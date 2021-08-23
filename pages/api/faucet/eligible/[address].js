import { utils } from "ethers";
import stakers from "../../../../constants/stake/sixth_august.json";
import devs from "../../../../constants/stake/dev_wallets.json";
export default async (req, res) => {
  const { address } = req.query;
  const checksumedAddress = utils.getAddress(address);
  const eligible = [stakers, devs].map(collection => collection.find(
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
