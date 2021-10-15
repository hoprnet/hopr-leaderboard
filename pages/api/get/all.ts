import { NextApiRequest, NextApiResponse } from "next";
import { client, did } from "../../../constants/api";
import { TileDocument } from "@ceramicnetwork/stream-tile";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    await did.authenticate();
    client.setDID(did);
  
    const records = await TileDocument.create(
      client,
      null,
      { deterministic: true, family: "hopr-wildhorn", tags: ["hopr-dashboard"] },
      { anchor: false, publish: false }
    );
  
    return res.status(200).json({
      status: "ok",
      tileId: records.id.toString(),
      records: records.content,
    });
  };
  