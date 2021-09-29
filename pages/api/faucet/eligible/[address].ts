import { utils } from "ethers";
import { NextApiRequest, NextApiResponse } from "next";
import { whitelisted } from "../../../../constants/api";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { address } = req.query;
  const checksumedAddress: string = utils.getAddress(address.toString());
  const eligible = whitelisted
    .map((collection: any) =>
      collection.find((staker: any) => staker.account === checksumedAddress)
    )
    .reduce((acc: any, val: any) => (acc ? acc : val));
  return eligible
    ? res.json({
        status: "ok",
        eligible: eligible.actual_stake,
      })
    : res.json({
        status: "err",
      });
};
