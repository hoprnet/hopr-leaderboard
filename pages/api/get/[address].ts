import { NextApiRequest, NextApiResponse } from "next";
import { client, did } from "../../../constants/api";
import { TileDocument } from "@ceramicnetwork/stream-tile";

const filterPerAddress = (records: any, address: string) =>
  Object.keys(records.content).filter(
    (hoprNode) => records.content[hoprNode] == address
  );

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { address }: any = req.query;
  await did.authenticate();
  client.setDID(did);

  const records = await TileDocument.create(
    client,
    null,
    { deterministic: true, family: "hopr-wildhorn", tags: [address] },
    { anchor: false, publish: false }
  );

  const addressRecords = filterPerAddress(records, address);

  return res.status(200).json({
    status: "ok",
    streamId: records.id.toString(),
    records: addressRecords,
  });
};
