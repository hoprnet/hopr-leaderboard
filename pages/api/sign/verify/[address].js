import {
  HOPR_WEB3_SIGNATURE_DOMAIN,
  HOPR_WEB3_SIGNATURE_FOR_NODE_TYPES,
  TOKEN_ADDRESS_POLYGON,
} from "../../../../constants/hopr";
import { verifySignatureFromPeerId } from "@hoprnet/hopr-utils";
import { formatEther } from "@ethersproject/units";
import HOPR_TOKEN_ABI from "../../../../constants/HoprTokenABI";
import { providers, utils, Wallet, Contract } from "ethers";

// NB: HOPR Node sign messages using the prefix to avoid having
// the nodes sign any generic data which could be used maliciously
// (e.g. a transfer request). Thus, we need to prefix the message
// to get a valid signature.
// see https://github.com/hoprnet/hoprnet/blob/master/packages/core/src/index.ts#L865-L870
const HOPR_PREFIX = "HOPR Signed Message: ";

export default async (req, res) => {
  const { address } = req.query;
  const { signature, message } = req.body;

  const signerAddress = utils.verifyTypedData(
    HOPR_WEB3_SIGNATURE_DOMAIN,
    HOPR_WEB3_SIGNATURE_FOR_NODE_TYPES,
    message,
    signature
  );
  const isValidSignature = address == signerAddress;

  if (isValidSignature) {
    const checksumedAddress = utils.getAddress(address);

    const { hoprSignature, hoprAddress, ethAddress } = message;
    const messageSignedByNode = `${HOPR_PREFIX}${ethAddress}`;
    const isAddressOwnerOfNode = await verifySignatureFromPeerId(
      hoprAddress,
      messageSignedByNode,
      hoprSignature
    );

    if (isAddressOwnerOfNode) {
      return res.status(200).json({
        status: "ok",
        message: `Your signature match and we connected it to our database.`,
      });
    } else {
      return res.status(200).json({
        status: "invalid",
        address: checksumedAddress,
        node: hoprAddress,
        message: `Your signature does not match the address you are submitting. Please try with a new signature.`,
      });
    }
  } else {
    return res.json({
      status: "err",
      message: "Signature is invalid.",
    });
  }
};
