import { Ed25519Provider } from "key-did-provider-ed25519";
import KeyResolver from "key-did-resolver";
import { DID } from "dids";
import CeramicClient from "@ceramicnetwork/http-client";
import { TileDocument } from "@ceramicnetwork/stream-tile";
import {
  HOPR_WEB3_SIGNATURE_DOMAIN,
  HOPR_WEB3_SIGNATURE_FOR_NODE_TYPES,
} from "../../../../../../constants/hopr";
import { CERAMIC_API_URL } from "../../../../../../constants/ceramic";

import { verifySignatureFromPeerId } from "@hoprnet/hopr-utils";
import { utils } from "ethers";

// NB: HOPR Node sign messages using the prefix to avoid having
// the nodes sign any generic data which could be used maliciously
// (e.g. a transfer request). Thus, we need to prefix the message
// to get a valid signature.
// see https://github.com/hoprnet/hoprnet/blob/master/packages/core/src/index.ts#L865-L870
const HOPR_PREFIX = "HOPR Signed Message: ";

const secretKey = Uint8Array.from(
  utils.arrayify(`0x${process.env.HOPR_DASHBOARD_API_PRIVATE_KEY}`)
);
const provider = new Ed25519Provider(secretKey);
const did = new DID({ provider, resolver: KeyResolver.getResolver() });
const client = new CeramicClient(CERAMIC_API_URL);

export default async (req, res) => {
  const { streamId, address } = req.query;
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

    try {
      const isAddressOwnerOfNode = await verifySignatureFromPeerId(
        hoprAddress,
        messageSignedByNode,
        hoprSignature
      );
      if (isAddressOwnerOfNode) {
        await did.authenticate();
        client.setDID(did);

        const dashboard = await TileDocument.create(client, null, {
          deterministic: true,
          tags: ["hopr-dashboard"],
          family: "hopr-wildhorn",
        });

        const mutatedDashboard = Object.assign({}, dashboard.content, {
          [streamId]: ethAddress,
        });

        // NB: We will not wait for the update of the dashboard to avoid issues w/timeouts.
        dashboard.update(mutatedDashboard);

        return res.status(200).json({
          status: "ok",
          streamId: dashboard.id.toString(),
          message: `The dashboard update was recorded into the Ceramic network.`,
        });
      } else {
        return res.status(200).json({
          status: "invalid",
          address: checksumedAddress,
          node: hoprAddress,
          message: `Your signature does not match the address you are submitting. Please try with a new signature.`,
        });
      }
    } catch (e) {
      return res.status(200).json({
        status: "err",
        hoprAddress,
        message: `Invalid HOPR address during dashboard verification: ${hoprAddress}. Please use a correct one or reach our ambassadors with your ETH address for support.`,
      });
    }
  } else {
    return res.json({
      status: "err",
      message: "Signature is invalid.",
    });
  }
};
