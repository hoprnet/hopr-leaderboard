import { constants } from "ethers";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import { IFaucet } from "../../types";
import { truncate } from "../../utils/string";
import { Images } from "../atoms/images/images";

interface FaucetBalanceProps {
  copyCodeToClipboard: (address: string) => void;
}

const initialState = {
  hopr: 0,
  native: 0,
  address: constants.AddressZero,
};

export const FaucetBalance: NextPage<FaucetBalanceProps> = ({
  copyCodeToClipboard,
}) => {
  const [faucet, setFaucet] = useState<IFaucet>(initialState);

  const loadBalance = async () => {
    const response = await (await fetch("/api/faucet/info")).json();
    if (response.faucet) {
      setFaucet(response.faucet);
    }
    return () => setFaucet(initialState);
  };

  useEffect(() => {
    loadBalance();
  }, []);

  return (
    <>
      {truncate(faucet.address)}
      <Images
        onClick={() => copyCodeToClipboard(faucet.address)}
        src="/assets/icons/copy.svg"
        alt="copy"
      />{" "}
      ({faucet.native.toFixed(4)} MATIC, {faucet.hopr.toFixed(4)} mHOPR)
    </>
  );
};
