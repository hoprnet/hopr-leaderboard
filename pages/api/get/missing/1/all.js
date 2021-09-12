import { uniqueEthAddresses } from "../../../../../constants/missing/1/addresses";

export default async (req, res) => {
  return res.status(200).json({
    status: "ok",
    addresses: uniqueEthAddresses,
  });
};
