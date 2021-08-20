import { constants } from "ethers";

// NB: Ideally we import this from our npm package but right now that requires
// nodejs 16 which is currently not supported in vercel until sept.
export const TOKEN_ADDRESS_POLYGON =
  "0x6F80d1a3AB9006548c2fBb180879b87364D63Bf7";
export const HOPR_ADDRESS_CHAR_LENGTH = 53;

export const HOPR_WEB3_SIGNATURE_DOMAIN = {
  name: "HOPR Faucet",
  version: "1",
  chainId: 137,
  verifyingContract: constants.AddressZero
};
export const HOPR_WEB3_SIGNATURE_PRIMARY_TYPE = "Node";
export const HOPR_WEB3_SIGNATURE_TYPES = {
  EIP712Domain: [
    { name: "name", type: "string" },
    { name: "version", type: "string" },
    { name: "chainId", type: "uint256" },
    { name: "verifyingContract", type: "address" },
  ],
  Node: [
    { name: "hoprAddress", type: "string" },
    { name: "ethAddress", type: "address" },
  ],
};
