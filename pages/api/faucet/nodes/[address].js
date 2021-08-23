import Ceramic from "@ceramicnetwork/http-client";
import { IDX } from "@ceramicstudio/idx";
import { PublicKey } from "@hoprnet/hopr-utils";
import PeerId from "peer-id";
import {
  CERAMIC_IDX_ALIASES,
  CERAMIC_IDX_HOPR_NAMESPACE,
  CERAMIC_API_URL,
} from "../../../../constants/ceramic";

export default async (req, res) => {
  try {
    const { address } = req.query;
    const { node } = req.body;
    const pId = await PeerId.createFromB58String(node);
    const ethAddress = PublicKey.fromPeerId(pId).toAddress().toHex();
    const ceramic = new Ceramic(CERAMIC_API_URL);
    const idx = new IDX({ ceramic, aliases: CERAMIC_IDX_ALIASES });

    const profile =
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
        ethAddress
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
