import React, { useState, useEffect } from "react";
import Layout from "../components/layout/layout.js";
import { ConnectWallet } from "../components/atoms/ConnectWallet";
import { FaucetBalance } from "../components/atoms/FaucetBalance";
import { VerifyNode } from "../components/atoms/VerifyNode";
import api from "../utils/api";
import { useEthers } from "@usedapp/core";

export default function Help() {
  const { account } = useEthers();
  const [hash, setHash] = useState("");
  const [showMsg, setShowMsg] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const response = await api.getAllData();
      if (response.data) setHash(response.data.address);
    };
    fetchData();
  }, []);

  const showCopyCode = () => {
    setShowMsg(true);
    setTimeout(() => {
      setShowMsg(false);
    }, 800);
  };

  const copyCodeToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showCopyCode();
  };

  return (
    <>
      <Layout toggle={showMsg}>
        <div className="box help-area">
          <div className="box-top-area">
            <div>
              <div className="box-title">
                <h1>Connect your node</h1>
              </div>
              <div className="box-btn">
                <p>HOPR Prompt v0.0.1</p>
              </div>
            </div>
          </div>

          <div className="box-main-area">
            <div className="quick-code">
              <small>
                Use the following tools to get HOPR tokens, connect your HOPR
                node to your identity, and other useful actions. All actions
                require a web3 provider like MetaMask to work.
              </small>
            </div>
            <hr />
            <ConnectWallet />
            { account && <VerifyNode /> }
            <hr />
            <div className="twitter-line-menu">
              <b>Faucet Balance:</b>
              <FaucetBalance />
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
