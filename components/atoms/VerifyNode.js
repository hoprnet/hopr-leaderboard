import { useEffect } from "react";

export const VerifyNode = ({ idx }) => {
  useEffect(() => {
    console.log("IDX (Verify Node)", idx);
  }, []);
  return (
    <div display="flex" style={{ margin: "10px 0" }}>
      <div style={{ marginBottom: "15px" }}>
        <p>
          <b>Request faucet funds</b>
        </p>
        <small>
          To claim a HOPR node, please write down your HOPR node address and press
          “Claim HOPR node on-chain”, which will prompt your web3 provider for a 
          signature. If your address is part of our staking program, we'll be funding
          your address with both MATIC (0.01) and (m)HOPR funds (10), otherwise we’ll
          only provide you with (m)HOPR funds. You can repeat this action for up to (10) nodes.
        </small>
        <div display="block" style={{ marginTop: "5px" }}>
          <input
            type="text"
            placeholder="16Uiu2HA..."
            style={{ width: "98%", padding: "5px" }}
          />
        </div>
        <button
          style={{
            backgroundColor: "rgba(0, 0, 80, 0.5)",
            marginTop: "5px",
          }}
        >
          Request funds via signature.
        </button>
      </div>
      <div>
        <p>
          <b>Verify</b>
        </p>
        <small>
          Copy your Ethereum address and go to the admin interface of your HOPR
          node. Using the command “sign”, sign your copied address and paste the
          result here.
        </small>
        <br />
        <small>e.g. “sign 0x2402da10A6172ED018AEEa22CA60EDe1F766655C”</small>
        <br />
        <br />
        <small>
          Copy and paste the contents of the sign function in the following text
          field and click on “Verify your HOPR node in IDX”. If valid, your node
          will then be shown as verified in our network with your Ethereum
          address.
        </small>
        <div display="block" style={{ marginTop: "5px" }}>
          <textarea
            placeholder="0x304402203208f46d1d25c4939760..."
            rows="3"
            display="block"
            style={{ width: "98%", padding: "5px" }}
          />
        </div>
        <button style={{ backgroundColor: "rgba(248, 114, 54, 0.5)" }}>
          Verify your HOPR node via IDX.
        </button>
      </div>
    </div>
  );
};
