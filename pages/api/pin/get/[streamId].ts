import { NextApiRequest, NextApiResponse } from "next";
import { client, did } from "../../../../constants/api";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const { streamId }: any = req.query;
      if (!streamId) {
        return res.status(200).json({
          status: "invalid",
          streamId,
          message: `No valid streamId provided. Please provide support with your ETH address for debugging.`,
        });
      }
      await did.authenticate();
      client.setDID(did);
      let isPinned: boolean = false;
      // NB: Not waiting to avoid blocking server
      const pinned: AsyncIterable<string> = await client.pin.ls(streamId);
      for await (const pinnedStreamId of pinned) {
          isPinned = pinnedStreamId == streamId
      }
  
      return res.status(200).json({
        status: "ok",
        isPinned,
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
  