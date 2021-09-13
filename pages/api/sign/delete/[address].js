import { Ed25519Provider } from "key-did-provider-ed25519";
import KeyResolver from "key-did-resolver";
import { DID } from "dids";
import CeramicClient from "@ceramicnetwork/http-client";
import { TileDocument } from "@ceramicnetwork/stream-tile";
import {
  HOPR_WEB3_SIGNATURE_DOMAIN,
  HOPR_WEB3_SIGNATURE_TYPES,
} from "../../../../constants/hopr";
import { CERAMIC_API_URL } from "../../../../constants/ceramic";

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
  const { address } = req.query;
  const { signature, message } = req.body;

  const signerAddress = utils.verifyTypedData(
    HOPR_WEB3_SIGNATURE_DOMAIN,
    HOPR_WEB3_SIGNATURE_TYPES,
    message,
    signature
  );
  const isValidSignature = address == signerAddress;

  if (isValidSignature) {    
    const { ethAddress, hoprAddress } = message;
      
    await did.authenticate();
    client.setDID(did);

    const docs = await TileDocument.create(client, null, {
        deterministic: true,
        tags: [ethAddress],
        family: "hopr-wildhorn",
    });

    const mutatedDoc = Object.assign({}, docs.content);
    delete mutatedDoc[hoprAddress]

    // // NB: No waiting on update to avoid blocking server
    docs.update(mutatedDoc);

    return res.status(200).json({
        status: "ok",
        streamId: docs.id.toString(),
        message: `Your node was deleted and updated into the Ceramic network.`,
    });
    
  } else {
    return res.json({
      status: "err",
      message: "Signature is invalid.",
    });
  }
};
