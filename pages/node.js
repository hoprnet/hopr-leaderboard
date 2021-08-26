import React, { useState, useEffect } from "react";
import Layout from "../components/layout/layout.js";
import { FaucetBalance } from "../components/atoms/FaucetBalance";
import { VerifyNode } from "../components/atoms/VerifyNode";
import api from "../utils/api";
import { useEthers } from "@usedapp/core";
import { Connectors } from "../components/molecules/Connectors";
import BoxRemember from "../components/micro-components/box-remember";

export default function Help() {
  const { account, library } = useEthers();
  const [idx, setIdx] = useState();
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

          <div className="box-main-area" style={{ marginBottom: '20px'}}>
            <div className="quick-code">
              <small>
                Use the following tools to get HOPR tokens, connect your HOPR
                node to your identity, and other useful actions. All actions
                require a web3 provider like MetaMask to work, and all
                information will be stored on the{" "}
                <a href="https://ceramic.network/" target="_blank">
                  Ceramic Network
                </a>
                , which only you can control via your web3 provider.
              </small>
            </div>
            <hr />
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                marginBottom: "10px",
              }}
            >
              <h3>Faucet</h3>
              <small style={{ marginLeft: "5px" }}>
                <FaucetBalance />
              </small>
            </div>
            <Connectors address={account} idx={idx} setIdx={setIdx} />
            {account && library && idx && <VerifyNode idx={idx} copyCodeToClipboard={copyCodeToClipboard}/>}
          </div>
          <BoxRemember />
        </div>
      </Layout>
    </>
  );
}
