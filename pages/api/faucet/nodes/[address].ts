import { NextApiRequest, NextApiResponse } from "next";
import PeerId from "peer-id";
import { PublicKey } from "@hoprnet/hopr-utils";
import Ceramic from "@ceramicnetwork/http-client";
import {
  CERAMIC_API_URL,
  CERAMIC_IDX_ALIASES,
  CERAMIC_IDX_HOPR_NAMESPACE,
} from "../../../../constants/ceramic";
import { IDX } from "@ceramicstudio/idx";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { address } = req.query;
    const { node } = req.body;
    const pId: PeerId = await PeerId.createFromB58String(node);
    const ethAddress: string = PublicKey.fromPeerId(pId).toAddress().toHex();
    const ceramic: Ceramic = new Ceramic(CERAMIC_API_URL);
    const idx: IDX = new IDX({ ceramic, aliases: CERAMIC_IDX_ALIASES });

    const profile: any =
      (await idx.get(CERAMIC_IDX_ALIASES.alias1, `${address}@eip155:137`)) ||
      {};

    if (
      profile[CERAMIC_IDX_HOPR_NAMESPACE] &&
      Object.keys(profile[CERAMIC_IDX_HOPR_NAMESPACE]).length > 0
    ) {
      res.statusCode = 200;
      return res.json({
        status: "ok",
        peerId: pId,
        ethAddress,
      });
    } else {
      res.statusCode = 501;
      return res.json({ status: "err" });
    }
  } catch (e) {
    res.statusCode = 501;
    return res.json({ status: "err" });
  }
};
