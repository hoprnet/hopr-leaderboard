import { NextApiRequest, NextApiResponse } from "next";
import { constants, Contract, providers, utils } from "ethers";
import { TOKEN_ADDRESS_POLYGON } from "../../../constants/hopr";
import { formatEther } from "@ethersproject/units";

const { HOPR_DASHBOARD_API_PRIVATE_KEY, HOPR_DASHBOARD_API_INFURA_ID } =
  process.env;

export default async (_req: NextApiRequest, res: NextApiResponse) => {
  if (!HOPR_DASHBOARD_API_PRIVATE_KEY) {
    return res.json({
      status: "ok",
      faucet: {
        hopr: +"0.00",
        native: +"0.00",
        address: constants.AddressZero,
      },
    });
  }
  const faucetAddress = utils.computeAddress(
    `0x${HOPR_DASHBOARD_API_PRIVATE_KEY}`
  );
  const provider = new providers.JsonRpcProvider(
    `https://polygon-mainnet.infura.io/v3/${HOPR_DASHBOARD_API_INFURA_ID}`
  );
  const faucetHoprBalance = await new Contract(
    TOKEN_ADDRESS_POLYGON,
    ["function balanceOf(address owner) view returns (uint256)"],
    provider
  )
    .balanceOf(faucetAddress)
    .then((b: string) => formatEther(b));

  const faucetNativeBalance: string = await provider
    .getBalance(faucetAddress)
    .then((b) => formatEther(b));

  if (faucetHoprBalance && faucetNativeBalance) {
    res.statusCode = 200;
    return res.json({
      status: "ok",
      faucet: {
        hopr: +faucetHoprBalance,
        native: +faucetNativeBalance,
        address: faucetAddress,
      },
    });
  } else {
    res.statusCode = 501;
    return res.json({ status: "err" });
  }
};
