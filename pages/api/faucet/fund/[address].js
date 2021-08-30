import {
  HOPR_WEB3_SIGNATURE_TYPES,
  HOPR_WEB3_SIGNATURE_DOMAIN,
  TOKEN_ADDRESS_POLYGON,
} from "../../../../constants/hopr";
import { formatEther } from "@ethersproject/units";
import HOPR_TOKEN_ABI from "../../../../constants/HoprTokenABI";
import { providers, utils, Wallet, Contract } from "ethers";

export default async (req, res) => {
  const { address } = req.query;
  const { signature, message } = req.body;

  const signerAddress = utils.verifyTypedData(
    HOPR_WEB3_SIGNATURE_DOMAIN,
    HOPR_WEB3_SIGNATURE_TYPES,
    message,
    signature
  );
  const isValidSignature = address == signerAddress;

  if (isValidSignature) {
    const checksumedAddress = utils.getAddress(address);

    const provider = new providers.JsonRpcProvider(
      `https://polygon-mainnet.infura.io/v3/${process.env.HOPR_DASHBOARD_API_INFURA_ID}`
    );
    const wallet = new Wallet(
      process.env.HOPR_DASHBOARD_API_PRIVATE_KEY,
      provider
    );

    const requesterBalance = await provider
      .getBalance(checksumedAddress)
      .then((b) => formatEther(b));
    const nodeBalance = await provider
      .getBalance(message.ethAddress)
      .then((b) => formatEther(b));

    // NB: The original polygon airdrop was for 0.01291,
    // so if they transfered anything out of that they
    // should also be eligible for faucet funds.
    if (nodeBalance < "0.01291") {
      const hoprTokenContract = new Contract(
        TOKEN_ADDRESS_POLYGON,
        HOPR_TOKEN_ABI,
        wallet
      );

      const transferAmount = "10";
      const transactions = [];

      // Always send 10 mHOPR tokens if node empty
      transactions.push(
        await hoprTokenContract.transfer(
          message.ethAddress,
          utils.parseEther(transferAmount)
        )
      );

      // Send 0.01 MATIC if both node AND requestor is empty
      if (requesterBalance == "0.0" && nodeBalance == "0.0") {
        transactions.push(
          await wallet.sendTransaction({
            to: message.ethAddress,
            value: utils.parseEther("0.01"),
          })
        );
      }

      return res.status(200).json({
        status: "ok",
        address,
        transactions,
        message: `Your request was successful. Please monitor the following transactions.`,
      });
    } else {
      return res.status(200).json({
        status: "err",
        message:
          nodeBalance == "0.0"
            ? "Requestor has MATIC to fund nodes"
            : "Node has MATIC already",
      });
    }
  } else {
    return res.json({
      status: "err",
      message: "Signature is invalid.",
    });
  }
};
