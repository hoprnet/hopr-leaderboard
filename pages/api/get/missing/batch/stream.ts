import { NextApiRequest, NextApiResponse } from "next";
import { client, did } from "../../../../../constants/api";
import { TileDocument } from "@ceramicnetwork/stream-tile";
import { IReduceStream } from "../../../../../types";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { batch } = req.query;
  await did.authenticate();
  client.setDID(did);

  const addresses = await import(
    `../../../../../constants/missing/${batch}/addresses`
  );

  try {
    const uniqueEthAddresses = addresses.uniqueEthAddresses;

    const resolvedStreams = await Promise.all(
      uniqueEthAddresses.map(async (ethAddress: string) => {
        const records = await TileDocument.create(
          client,
          null,
          { deterministic: true, family: "hopr-wildhorn", tags: [ethAddress] },
          { anchor: false, publish: false }
        );
        return { ethAddress, streamId: records.id.toString() };
      })
    );

    const streams = resolvedStreams.reduce((acc: { [key: string]: string }, val: IReduceStream | any) => {
      acc[val.streamId] = val.ethAddress;
      return acc;
    }, {});

    return res.status(200).json({
      status: "ok",
      streams,
    });
  } catch {
    return res.status(200).json({
      status: "err",
      message: "Batch doesn’t exist or has no streams to share.",
    });
  }
};
