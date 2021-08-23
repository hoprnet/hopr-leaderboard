import { useEffect, useState } from "react";

export const FaucetBalance = () => {
  const [faucetBalance, setFaucetBalance] = useState({ hopr: 0, native: 0});
  useEffect(() => {
    const loadBalance = async () => {
      const response = await (await fetch("/api/faucet/balance")).json();
      if (response.balance) {
        setFaucetBalance(response.balance);
      }
    };
    loadBalance();
  }, []);
  return <>{' '}{faucetBalance.native} MATIC, {faucetBalance.hopr} (m)HOPR</>;
};
