import { NextApiRequest, NextApiResponse } from "next";
import PeerId from "peer-id";
import { PublicKey } from "@hoprnet/hopr-utils";
import { Client, createClient } from "@urql/core";
import { ENDPOINT, QUERY_GET_ACCOUNT } from "../../../constants/querys";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { node }: any = req.query;
    const pId = await PeerId.createFromB58String(node);
    const address = PublicKey.fromPeerId(pId).toAddress().toHex().toLowerCase();

    const client: Client = createClient({
      url: ENDPOINT,
      fetchOptions: {
        mode: "cors", // no-cors, cors, *same-origin
      },
    });
    const { data } = await client
      .query(QUERY_GET_ACCOUNT, { id: address })
      .toPromise();

    const result: object = {
      id: node,
      address,
      openedChannels: data.accounts[0].openedChannels,
      closedChannels: data.accounts[0].closedChannels,
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
