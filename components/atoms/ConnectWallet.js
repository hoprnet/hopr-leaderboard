import { useEthers, useEtherBalance, useTokenBalance } from "@usedapp/core";
import { formatEther } from "@ethersproject/units";
import { TOKEN_ADDRESS_POLYGON } from "../../constants/hopr";

export const ConnectWallet = ({ children }) => {
  const { activateBrowserWallet, account, deactivate } = useEthers();
  const tokenBalance = useTokenBalance(TOKEN_ADDRESS_POLYGON, account);
  const etherBalance = useEtherBalance(account);
  return (
    <div>
      <div className="box-btn">
        <div display="flex">
          <button onClick={!account ? activateBrowserWallet : deactivate} style={{ marginRight: "5px"}}>
            {!account ? "Connect" : "Disconnect"}
          </button>
          {!account && (
            <small style={{ marginLeft: "10px" }}>
              Only available in Polygon/Matic network.
            </small>
          )}
          {children}
        </div>
      </div>
      {account && <p>Account: {account}</p>}
      {etherBalance && <p>Balance: {formatEther(etherBalance)}</p>}
      {tokenBalance && <p>(m)HOPR: {formatEther(tokenBalance)}</p>}
    </div>
  );
};
