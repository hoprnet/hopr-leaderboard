import React from "react";
import { useEthers, useEtherBalance, useTokenBalance } from "@usedapp/core";
import { formatEther } from "@ethersproject/units";
import { TOKEN_ADDRESS_POLYGON } from "../../constants/hopr";
import { NextPage } from "next";
import { Buttons } from "../atoms/buttons";

interface ConnectWalletProps {}

export const ConnectWallet: NextPage<ConnectWalletProps> = ({ children }) => {
  const { activateBrowserWallet, account, deactivate } = useEthers();
  const tokenBalance = useTokenBalance(TOKEN_ADDRESS_POLYGON, account);
  const etherBalance = useEtherBalance(account);
  return (
    <div>
      <div className="box-btn">
        <div className="connect-wallet">
          <Buttons
            text={!account ? "Connect" : "Disconnect"}
            onClick={!account ? activateBrowserWallet : deactivate}
          />

          {!account && <p>Only available in Polygon/Matic network.</p>}
          {children}
        </div>
      </div>
      {account && <p>Account: {account}</p>}
      {etherBalance && <p>Balance: {formatEther(etherBalance)}</p>}
      {tokenBalance && <p>(m)HOPR: {formatEther(tokenBalance)}</p>}
    </div>
  );
};
