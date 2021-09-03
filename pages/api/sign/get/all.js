import { Ed25519Provider } from "key-did-provider-ed25519";
import KeyResolver from "key-did-resolver";
import { DID } from "dids";
import CeramicClient from "@ceramicnetwork/http-client";
import { TileDocument } from "@ceramicnetwork/stream-tile";
import { CERAMIC_API_URL } from "../../../../constants/ceramic";

import { utils } from "ethers";

const secretKey = Uint8Array.from(
  utils.arrayify(`0x${process.env.HOPR_DASHBOARD_API_PRIVATE_KEY}`)
);
const provider = new Ed25519Provider(secretKey);
const did = new DID({ provider, resolver: KeyResolver.getResolver() });
const client = new CeramicClient(CERAMIC_API_URL);
let tile = null;

export default async (req, res) => {
  if (!tile) {
    await did.authenticate();
    client.setDID(did);
    tile = await TileDocument.create(client, {});
  }

  const records = await TileDocument.load(client, tile.id);

  return res.status(200).json({
    status: "ok",
    records: records.content,
  });
};
