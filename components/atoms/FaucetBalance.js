import { constants } from "ethers";
import { useEffect, useState } from "react";
import { truncate } from "../../utils/string";

export const FaucetBalance = ({ copyCodeToClipboard }) => {
  const initialState = {
    hopr: 0,
    native: 0,
    address: constants.AddressZero,
  };
  const [faucet, setFaucet] = useState(initialState);
  useEffect(() => {
    const loadBalance = async () => {
      const response = await (await fetch("/api/faucet/info")).json();
      if (response.faucet) {
        setFaucet(response.faucet);
      }
      return () => setFaucet(initialState);
    };
    loadBalance();
  }, []);
  return (
    <>
      {truncate(faucet.address)}
      <img
        onClick={() => copyCodeToClipboard(faucet.address)}
        style={{ marginLeft: 8, cursor:"pointer" }}
        src="/assets/icons/copy.svg"
        alt="copy"
      />{" "}
      ({faucet.native.toFixed(4)} MATIC, {faucet.hopr.toFixed(4)} mHOPR)
    </>
  );
};
