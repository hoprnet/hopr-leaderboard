import { NextApiRequest, NextApiResponse } from "next";
import { client, did } from "../../../constants/api";
import { TileDocument } from "@ceramicnetwork/stream-tile";

const filterPerAddress = (records: TileDocument<null>, address: string) =>
  Object.keys((records.content as unknown as TileDocument<string>)).filter(
    (hoprNode) => (records.content || "")[hoprNode as unknown as number] == address
  );

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { address } = req.query;
  await did.authenticate();
  client.setDID(did);

  const records = await TileDocument.create(
    client,
    null,
    { deterministic: true, family: "hopr-wildhorn", tags: [address.toString()] },
    { anchor: false, publish: false }
  );

  const addressRecords = filterPerAddress(records, address.toString());

  return res.status(200).json({
    status: "ok",
    streamId: records.id.toString(),
    records: addressRecords,
  });
};
