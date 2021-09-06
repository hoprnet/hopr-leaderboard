import { Ed25519Provider } from "key-did-provider-ed25519";
import KeyResolver from "key-did-resolver";
import { DID } from "dids";
import CeramicClient from "@ceramicnetwork/http-client";
import { TileDocument } from "@ceramicnetwork/stream-tile";
import {
  CERAMIC_API_URL,
  CERAMIC_TILE_ID,
} from "../../../../constants/ceramic";

import { utils } from "ethers";

const secretKey = Uint8Array.from(
  utils.arrayify(`0x${process.env.HOPR_DASHBOARD_API_PRIVATE_KEY}`)
);
const provider = new Ed25519Provider(secretKey);
const did = new DID({ provider, resolver: KeyResolver.getResolver() });
const client = new CeramicClient(CERAMIC_API_URL);
const tileId = CERAMIC_TILE_ID;

export default async (req, res) => {
  const { flattened } = req.query;
  await did.authenticate();
  client.setDID(did);

  const records = await TileDocument.load(client, tileId);

  if (flattened) {
    const ethAddress = Object.values(records.content);
    const correspondingHoprNode = Object.keys(records.content);
    return res.status(200).json({
      status: "ok",
      ethAddress,
      correspondingHoprNode
    })
  }

  return res.status(200).json({
    status: "ok",
    tileId,
    records: records.content,
  });
};
