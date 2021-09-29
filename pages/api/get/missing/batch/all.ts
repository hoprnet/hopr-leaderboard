import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { batch } = req.query;
    const addresses = await import(`../../../../../constants/missing/${batch}/addresses`);
    return res.status(200).json({
      status: "ok",
      addresses: addresses.nodesMap ? Object.values(addresses.nodesMap) : addresses.uniqueEthAddresses ? addresses.uniqueEthAddresses : [],
      nodes: addresses.nodesMap
    });
  };
  