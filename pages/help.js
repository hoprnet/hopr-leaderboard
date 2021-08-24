import React, { useState } from "react";
import Layout from "../components/layout/layout.js";
import { Instructions } from "../components/atoms/Instructions";

export default function Help() {
  const [showMsg, setShowMsg] = useState(false);
  const [instructionsTarget, setInstructionsTarget] = useState('npm');

  return (
    <>
      <Layout toggle={showMsg}>
        <div className="box help-area">
          <div className="box-top-area">
            <div>
              <div className="box-title">
                <h1>Help</h1>
              </div>
              <div className="box-btn">
                <p>v0.01</p>
              </div>
            </div>
          </div>

          <div className="box-main-area">
            <div className="quick-code">
              <small>
                Welcome to our Polygon Wildhorn testnet. Please follow the
                instructions to participate in our network and earn NFTs which
                you can trade or use in our staking program.
              </small>
            </div>
            <hr />
            <h3>Instructions</h3>
            <span>Pick your distribution.</span>
            {["npm", "docker", "avado"].map((dist) => (
              <button
                style={{
                  marginRight: "5px",
                  fontWeight: dist === instructionsTarget && "900",
                }}
                onClick={() => setInstructionsTarget(dist)}
              >
                {dist}
              </button>
            ))}
            <Instructions
              setShowMsg={setShowMsg}
              instructionsTarget={instructionsTarget}
            />
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
