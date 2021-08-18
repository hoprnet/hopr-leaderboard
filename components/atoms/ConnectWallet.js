import { useEthers, useEtherBalance, useTokenBalance } from "@usedapp/core";
import { formatEther } from "@ethersproject/units";
import { TOKEN_ADDRESS_POLYGON } from "../../constants/hopr";

export const ConnectWallet = () => {
  const { activateBrowserWallet, account, deactivate } = useEthers();
  const tokenBalance = useTokenBalance(TOKEN_ADDRESS_POLYGON, account);
  const etherBalance = useEtherBalance(account);
  return (
    <div>
      <div className="box-btn">
        <button onClick={!account ? activateBrowserWallet : deactivate}>
          {!account ? "Connect" : "Disconnect"}
        </button>
      </div>
      {account && <p>Account: {account}</p>}
      {etherBalance && <p>Balance: {formatEther(etherBalance)}</p>}
      {tokenBalance && <p>(m)HOPR: {formatEther(tokenBalance)}</p>}
    </div>
  );
};
