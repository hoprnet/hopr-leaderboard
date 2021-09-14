import PeerId from "peer-id";
import { PublicKey } from "@hoprnet/hopr-utils";

export const convertHoprAddressToETHAddress = (hoprAddress) => {
  try {
  const pId = PeerId.createFromB58String(hoprAddress);
  const ethAddress = PublicKey.fromPeerId(pId).toAddress().toHex();
  return ethAddress;
} catch (err) {
  console.error(`Given hoprAddress ${hoprAddress} is not a valid HOPR address.`)
  throw new Error(err)
}
};
