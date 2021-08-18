import React, { useState, useEffect } from "react";
import Layout from "../components/layout/layout.js";
import TweetBasodino from "../components/tweet-basodino";
import api from "../utils/api";

export default function Help() {
  const [hash, setHash] = useState('');
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
              <small>Use the following tools to get HOPR tokens, connect your HOPR node to your identity, and other useful actions. All actions require a web3 provider.</small>
            </div>
            <hr />
            Actions to be shown here.
            <hr />
            <div className="twitter-line-menu">
              <a
                className="aux-help-twitter"
                href="https://twitter.com/hoprnet"
                target="_blank"
              >
                <div>
                  <img src="/assets/icons/twitter.svg" alt="twitter" />
                </div>
                <div>
                  <p>@hoprnet</p>
                  <span>click here to tweet</span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
