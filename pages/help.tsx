import { NextPage } from "next";
import React, { useState } from "react";
import { Buttons } from "../components/atoms/buttons";
import BoxRemember from "../components/molecules/boxRemember";
import { Instructions } from "../components/organisms/instructions";
import Layout from "../components/organisms/layout";

interface HelpProps {}

const Help: NextPage<HelpProps> = ({}) => {
  const [showMsg, setShowMsg] = useState<boolean>(false);
  const [instructionsTarget, setInstructionsTarget] = useState<string>("npm");

  return (
    <>
      <Layout toggle={showMsg}>
        <div className="box">
          <div className="box-top-area">
            <div>
              <div>
                <h1>Help</h1>
              </div>
              <div>
                <p>v0.01</p>
              </div>
            </div>
          </div>

          <div className="box-main-area">
            {/* <div className="quick-code"> */}
              <p>
                Welcome to our Polygon Wildhorn testnet. Please follow the
                instructions to participate in our network and earn NFTs which
                you can trade or use in our staking program.
              </p>
            {/* </div> */}
            <hr />
            <h3>Instructions</h3>
            <span>Pick your distribution.</span>
            {["npm", "docker", "avado"].map((dist) => (
              <Buttons
                key={dist}
                className={`pick-distribution ${dist == instructionsTarget && 'condition-dist' }`}
                onClick={() => setInstructionsTarget(dist)}
                text={dist}
              />
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
