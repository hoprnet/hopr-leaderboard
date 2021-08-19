import { useEffect, useState } from "react";

export const VerifyNode = ({ idx }) => {
  const [inputValue, setInputValue] = useState();
  const [hasError, setError] = useState();
  const addHOPRNodeToIDX = () => {
    // @TODO:
    // 1. Verify that inputValue is an actual HOPR node
    // 2. Store the HOPR node data in the user HOPR IDX alias
    // 3. Populate the required hooks.
  };
  useEffect(() => {
    // @TODO: 
    // 1. Verify with IDX we are connected.
    // 2. Load the needed information from IDX
    // 3. Populate the required hooks
    // console.log("IDX (Verify Node)", idx);
  }, []);
  return (
    <div display="flex" style={{ margin: "10px 0" }}>
      <div style={{ marginBottom: "15px" }}>
        <p>
          <b>Add HOPR node</b> Faucet
        </p>
        <small>
          By adding a HOPR node, you can request funds from our faucet. You can
          add any HOPR node, even if it’s not controlled by you. By clicking
          “Add HOPR node”, your web3 provider will ask you to sign a message
          from your address.
        </small>
        <br />
        <br />
        <small>
          If your address is part of our staking program, we'll be funding your
          address with both MATIC (0.01) and (m)HOPR funds (10), otherwise we’ll
          only provide you with (m)HOPR funds. You can repeat this action for up
          to (10) nodes.
        </small>
        <div display="block" style={{ marginTop: "5px" }}>
          <input
            type="text"
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="16Uiu2HA..."
            style={{ width: "98%", padding: "5px" }}
          />
        </div>
        <div>
          <button
            style={{
              backgroundColor: "rgba(248, 114, 54, 0.5)",
              marginTop: "5px",
            }}
            onClick={() => {
              addHOPRNodeToIDX();
            }}
          >
            Add node for funding.
          </button>
          { hasError && <span style={{ marginLeft: "5px" }}>Error.</span> }
        </div>
      </div>
      <div>
        <p>
          <b>Verify HOPR node</b>
        </p>
        <small>
          By verifying your node, you are elegible to NFT rewards based on the
          on-chain actions your node(s) execute(s). You can only verify nodes
          you control. Copy your Ethereum address and go to the admin interface
          of your HOPR node. Using the command “sign”, sign your copied address
          and paste the result here. e.g. “sign
          0x2402da10A6172ED018AEEa22CA60EDe1F766655C”
        </small>
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
          Verify node for rewards.
        </button>
      </div>
    </div>
  );
};
