import { Ed25519Provider } from "key-did-provider-ed25519";
import KeyResolver from "key-did-resolver";
import { DID } from "dids";
import CeramicClient from "@ceramicnetwork/http-client";
import { CERAMIC_API_URL } from "../../../constants/ceramic";

import { utils } from "ethers";

const secretKey = Uint8Array.from(
  utils.arrayify(`0x${process.env.HOPR_DASHBOARD_API_PRIVATE_KEY}`)
);
const provider = new Ed25519Provider(secretKey);
const did = new DID({ provider, resolver: KeyResolver.getResolver() });
const client = new CeramicClient(CERAMIC_API_URL);

export default async (req, res) => {
  try {
    const { streamId } = req.query;
    if (!streamId) {
      return res.status(200).json({
        status: "invalid",
        streamId,
        message: `No valid streamId provided. Please provide support with your ETH address for debugging.`,
      });
    }
    await did.authenticate();
    client.setDID(did);
    await client.pin.add(streamId);

    return res.status(200).json({
      status: "ok",
      streamId,
      message: `Your stream was pinned into the Ceramic network.`,
    });
  } catch (err) {
    return res.status(200).json({
      status: "err",
      err,
      message: `Error pinning your node info to Ceramic. Please provide support with your ETH address for debugging.`,
    });
  }
};
