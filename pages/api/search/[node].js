import { PublicKey } from "@hoprnet/hopr-utils";
import PeerId from "peer-id";
import { createClient } from "@urql/core";
import { ENDPOINT, QUERY_GET_ACCOUNT } from "../../../constants/queries";
import { getImportanceScore } from "../../../constants/score";

export default async (req, res) => {
  try {
    const { node } = req.query;
    const pId = await PeerId.createFromB58String(node);
    const address = PublicKey.fromPeerId(pId).toAddress().toHex().toLowerCase();

    const client = createClient({
      url: ENDPOINT,
      fetchOptions: {
        mode: "cors", // no-cors, cors, *same-origin
      },
    });
    const { data } = await client
      .query(QUERY_GET_ACCOUNT, { id: address })
      .toPromise();

    const result = {
      id: node,
      address,
      balance: data.accounts[0].balance,
      openedChannels: data.accounts[0].fromChannels.filter(c => c.status === 'OPEN').length,
      closedChannels: data.accounts[0].fromChannels.filter(c => c.status === 'CLOSED').length,
      importanceScore: getImportanceScore(data.accounts[0])
    };
    return res.json({
      ...result,
    });
  } catch (e) {
    console.error("Internal Server Error", e);
    return res.json({
      status: "err",
      message: e,
    });
  }
};
