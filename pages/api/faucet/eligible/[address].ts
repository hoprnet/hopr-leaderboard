import { utils } from "ethers";
import { NextApiRequest, NextApiResponse } from "next";
import { whitelisted } from "../../../../constants/api";

interface collection {
  account: string;
  actual_stake: number;
  virtual_stake: number;
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { address } = req.query;
  const checksumedAddress: string = utils.getAddress(address.toString());
  const eligible = whitelisted
    .map((collection: collection[]) =>
      collection.find(
        (staker: { account: string }) => staker.account === checksumedAddress
      )
    )
    .reduce((acc: collection | undefined, val: collection | undefined): collection => ((acc ? acc : val) as collection));
  return eligible
    ? res.json({
        status: "ok",
        eligible: eligible.actual_stake,
      })
    : res.json({
        status: "err",
      });
};
