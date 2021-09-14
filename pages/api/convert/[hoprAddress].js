import { convertHoprAddressToETHAddress } from "../../../utils/hopr";

export default async (req, res) => {
  const { hoprAddress } = req.query;
  try {
    const ethAddress = convertHoprAddressToETHAddress(hoprAddress);
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
