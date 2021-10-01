import React, { useState, useEffect } from "react";
import { NextPage } from "next";
import { useEthers } from "@usedapp/core";
import api from "../utils/api";
import Layout from "../components/organisms/layout";
import { Connectors } from "../components/organisms/connectors";
import BoxRemember from "../components/molecules/boxRemember";
import { FaucetBalance } from "../components/organisms/faucetBalance";
import { VerifyNode } from "../components/organisms/verifyNode";
import { IDX } from "@ceramicstudio/idx";

interface NodeProps {}

const Node: NextPage<NodeProps> = ({}) => {
  const { account, library } = useEthers();
  const [idx, setIdx] = useState<IDX | null>();
  const [hash, setHash] = useState<string>("");
  const [showMsg, setShowMsg] = useState<boolean>(false);

  const sendSignatureToAPI = async (
    endpoint: string,
    signature: string,
    message: object
  ) => {
    const response = await fetch(endpoint, {
      body: JSON.stringify({ signature, message }),
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json",
        Accept: "application/json",
      }),
    }).then((res) => res.json());
    return response;
  };

  const getWeb3SignatureFaucetContents = (
    hoprAddress: string,
    ethAddress: string
  ) => (
    {
    hoprAddress,
    ethAddress,
    }
  );

  const getWeb3SignatureVerifyContents = (
    hoprAddress: string,
    hoprSignature: string,
    ethAddress: string
  ) => ({
    hoprAddress,
    hoprSignature,
    ethAddress,
  });

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

  const copyCodeToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showCopyCode();
  };

  return (
    <Layout toggle={showMsg}>
      <div className="box help-area">
        <div className="box-top-area">
          <div className="box-title">
            <h1>Connect your node</h1>
          </div>
          <div className="box-btn">
            <p>HOPR Prompt v0.0.1</p>
          </div>
        </div>

        <div className="box-main-area" style={{ marginBottom: "20px" }}>
          <div className="quick-code">
            <small>
              Use the following tools to get HOPR tokens, connect your HOPR node
              to your identity, and other useful actions. All actions require a
              web3 provider like MetaMask to work, and all information will be
              stored on the{" "}
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
              <FaucetBalance copyCodeToClipboard={showCopyCode} />
            </small>
          </div>
          <Connectors address={account} connectIdx idx={idx} setIdx={setIdx} />
          {account && library && idx && (
            <VerifyNode
              idx={idx}
              copyCodeToClipboard={copyCodeToClipboard}
              sendSignatureToAPI={sendSignatureToAPI}
              getWeb3SignatureFaucetContents={getWeb3SignatureFaucetContents}
              getWeb3SignatureVerifyContents={getWeb3SignatureVerifyContents}
            />
          )}
        </div>
        <BoxRemember leaderboardData={[]} />
      </div>
    </Layout>
  );
};

export default Node;
