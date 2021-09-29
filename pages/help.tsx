import { NextPage } from "next";
import React, { useState } from "react";
import BoxRemember from "../components/molecules/boxRemember";
import { Instructions } from "../components/organisms/instructions";
import Layout from "../components/organisms/layout";

export interface HelpProps {}

const Help: NextPage<HelpProps> = ({}) => {
  const [showMsg, setShowMsg] = useState(false);
  const [instructionsTarget, setInstructionsTarget] = useState("npm");

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
                key={dist}
                style={{
                  marginRight: "5px",
                  fontWeight: dist == instructionsTarget ? 900 : undefined
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
          </div>
          <BoxRemember leaderboardData={[]} />
        </div>
      </Layout>
    </>
  );
};

export default Help;
