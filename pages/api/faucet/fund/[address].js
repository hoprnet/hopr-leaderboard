import {
  HOPR_WEB3_SIGNATURE_TYPES,
  HOPR_WEB3_SIGNATURE_DOMAIN,
} from "../../../../constants/hopr";
import { verifyTypedData } from "ethers/lib/utils";

//@TODO:
//1. [✅] Get address and signature, verify that indeed they match.
//2. [ ] Using that signature, look up the eligibility for funds.
//3. [ ] Trigger a transferFrom call with the eligible funds and send receipt.
export default async (req, res) => {
  const { address } = req.query;
  const { signature, message } = req.body;

  const signerAddress = verifyTypedData(
    HOPR_WEB3_SIGNATURE_DOMAIN,
    HOPR_WEB3_SIGNATURE_TYPES,
    message,
    signature
  );
  const isValidSignature = address == signerAddress;

  return res.json({
    status: "ok",
    address,
    signature,
    isValidSignature,
  });
};
