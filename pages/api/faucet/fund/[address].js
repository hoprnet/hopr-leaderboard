import {
  HOPR_WEB3_SIGNATURE_TYPES,
  HOPR_WEB3_SIGNATURE_DOMAIN,
  TOKEN_ADDRESS_POLYGON,
} from "../../../../constants/hopr";
import stakers from "../../../../constants/stake/sixth_august.json";
import devs from "../../../../constants/stake/dev_wallets.json";
import HOPR_TOKEN_ABI from "../../../../constants/HoprTokenABI";
import { providers, utils, Wallet, Contract } from "ethers";

//@TODO:
//1. [✅] Get address and signature, verify that indeed they match.
//2. [✅] Using that signature, look up the eligibility for funds.
//3. [⏰] Trigger a transferFrom call with the eligible funds and send receipt.
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
    const eligible = [stakers, devs]
      .map((collection) =>
        collection.find((staker) => staker.account === checksumedAddress)
      )
      .reduce((acc, val) => (acc ? acc : val));

    const provider = new providers.JsonRpcProvider(
      `https://polygon-mainnet.infura.io/v3/${process.env.HOPR_DASHBOARD_API_INFURA_ID}`
    );
    const wallet = new Wallet(
      process.env.HOPR_DASHBOARD_API_PRIVATE_KEY,
      provider
    );
    const hoprTokenContract = new Contract(
      TOKEN_ADDRESS_POLYGON,
      HOPR_TOKEN_ABI,
      wallet
    );

    let transferAmount;
    const transactions = [];
    if (eligible) {
      // Send 0.01 MATIC, and eligible.actual_stake mHOPR to message.ethAddress
      transferAmount = "3";
      transactions.push(
        await wallet.sendTransaction({
          to: message.ethAddress,
          value: utils.parseEther("0.001"),
        })
      );
    } else {
      // Send 0 MATIC, and 10 mHOPR to message.ethAddress
      transferAmount = "1";
    }
    transactions.push(
      await hoprTokenContract.transfer(
        message.ethAddress,
        utils.parseEther(transferAmount)
      )
    );

    return res.status(200).json({
      status: "ok",
      address,
      transactions,
    });
  } else {
    return res.json({
      status: "err",
      message: "Signature is invalid.",
    });
  }
};
