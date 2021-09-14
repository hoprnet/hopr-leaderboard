export default async (req, res) => {
  const { batch } = req.query;
  const addresses = await import(`../../../../../constants/missing/${batch}/addresses`);
  return res.status(200).json({
    status: "ok",
    addresses: addresses.uniqueEthAddresses ? addresses.uniqueEthAddresses : [],
  });
};
