import { Ed25519Provider } from 'key-did-provider-ed25519'
import KeyResolver from 'key-did-resolver'
import { DID } from 'dids'
import CeramicClient from '@ceramicnetwork/http-client'
import { TileDocument } from '@ceramicnetwork/stream-tile'
import {
  HOPR_WEB3_SIGNATURE_DOMAIN,
  HOPR_WEB3_SIGNATURE_FOR_NODE_TYPES,
  TOKEN_ADDRESS_POLYGON,
} from "../../../../constants/hopr";
import {
  CERAMIC_API_URL
} from "../../../../constants/ceramic";

import { verifySignatureFromPeerId } from "@hoprnet/hopr-utils";
import { formatEther } from "@ethersproject/units";
import HOPR_TOKEN_ABI from "../../../../constants/HoprTokenABI";
import { providers, utils, Wallet, Contract } from "ethers";

// NB: HOPR Node sign messages using the prefix to avoid having
// the nodes sign any generic data which could be used maliciously
// (e.g. a transfer request). Thus, we need to prefix the message
// to get a valid signature.
// see https://github.com/hoprnet/hoprnet/blob/master/packages/core/src/index.ts#L865-L870
const HOPR_PREFIX = "HOPR Signed Message: ";

const secretKey = Uint8Array.from(utils.arrayify(`0x${process.env.HOPR_DASHBOARD_API_PRIVATE_KEY}`))
const provider = new Ed25519Provider(secretKey)
const did = new DID({ provider, resolver: KeyResolver.getResolver() })
const client = new CeramicClient(CERAMIC_API_URL)
let tile = null

export default async (req, res) => {
  const { address } = req.query;
  const { signature, message } = req.body;

  const signerAddress = utils.verifyTypedData(
    HOPR_WEB3_SIGNATURE_DOMAIN,
    HOPR_WEB3_SIGNATURE_FOR_NODE_TYPES,
    message,
    signature
  );
  const isValidSignature = address == signerAddress;

  if (isValidSignature) {
    const checksumedAddress = utils.getAddress(address);
    const { hoprSignature, hoprAddress, ethAddress } = message;
    const messageSignedByNode = `${HOPR_PREFIX}${ethAddress}`;

    const isAddressOwnerOfNode = await verifySignatureFromPeerId(
      hoprAddress,
      messageSignedByNode,
      hoprSignature
    );

    if (isAddressOwnerOfNode) {
      // @TODO: Move from API endpoint as this gets called everytime.
      if (!tile) {
        await did.authenticate()
        client.setDID(did)
        tile = await TileDocument.create(client, {})
      }

      const records = await TileDocument.load(client, tile.id)
      const mutatedRecords = Object.assign({}, records.content, { [hoprAddress]: ethAddress })
      await tile.update(mutatedRecords)

      return res.status(200).json({
        status: "ok",
        tile: tile.id.toString(),
        message: `Your node was recorded into the Ceramic network.`,
      });

    } else {
      return res.status(200).json({
        status: "invalid",
        address: checksumedAddress,
        node: hoprAddress,
        message: `Your signature does not match the address you are submitting. Please try with a new signature.`,
      });
    }
  } else {
    return res.json({
      status: "err",
      message: "Signature is invalid.",
    });
  }
};
