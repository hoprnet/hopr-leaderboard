import PeerId from "peer-id";
import { PublicKey } from "@hoprnet/hopr-utils";

export const convertHoprAddressToETHAddress = (hoprAddress) => {
  const pId = PeerId.createFromB58String(hoprAddress);
  const ethAddress = PublicKey.fromPeerId(pId).toAddress().toHex();
  return ethAddress;
};
