import { NextApiRequest, NextApiResponse } from "next";
import { client, did } from "../../../constants/api";
import { StreamID } from "@ceramicnetwork/streamid";

export default async (req: NextApiRequest, res: NextApiResponse) => {
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

    // NB: Not waiting to avoid blocking server
    client.pin.add(streamId as unknown as StreamID);

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
