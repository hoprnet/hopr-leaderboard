import PeerId from "peer-id";
import { PublicKey } from "@hoprnet/hopr-utils";

export const convertHoprAddressToETHAddress = (hoprAddress: string | string[]) => {
  try {
  const pId = PeerId.createFromB58String(hoprAddress.toString());
  const ethAddress = PublicKey.fromPeerId(pId).toAddress().toHex();
  return ethAddress;
} catch (err: any) {
  console.error(`Given hoprAddress ${hoprAddress} is not a valid HOPR address.`)
  throw new Error(err)
}
};
