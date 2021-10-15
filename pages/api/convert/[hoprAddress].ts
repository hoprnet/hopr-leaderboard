import { NextApiRequest, NextApiResponse } from "next";
import { convertHoprAddressToETHAddress } from "../../../utils/hopr";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { hoprAddress } = req.query;
  try {
    const ethAddress: string = convertHoprAddressToETHAddress(hoprAddress);
    return res.status(200).json({
      status: "ok",
      ethAddress,
    });
  } catch (err) {
    return res.status(200).json({
      status: "err",
      err,
    });
  }
};
