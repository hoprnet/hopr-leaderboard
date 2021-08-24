import { utils } from "ethers";
import { whitelisted } from "../../../../constants/stake";

export default async (req, res) => {
  const { address } = req.query;
  const checksumedAddress = utils.getAddress(address);
  const eligible = whitelisted.map(collection => collection.find(
    (staker) => staker.account === checksumedAddress
  )).reduce((acc, val) => acc ? acc : val);
  return eligible
    ? res.json({
        status: "ok",
        eligible: eligible.actual_stake,
      })
    : res.json({
        status: "err",
      });
};
