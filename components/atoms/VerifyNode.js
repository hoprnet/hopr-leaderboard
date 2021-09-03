import { useEthers } from "@usedapp/core";
import { useEffect, useState } from "react";
import { truncate } from "../../utils/string";

import { EligibilityPerAddress } from "./EligibilityPerAddress";
import {
  CERAMIC_IDX_ALIASES,
  CERAMIC_IDX_HOPR_NAMESPACE,
} from "../../constants/ceramic";
import {
  HOPR_ADDRESS_CHAR_LENGTH,
  HOPR_WEB3_SIGNATURE_DOMAIN,
  HOPR_WEB3_SIGNATURE_TYPES,
  HOPR_WEB3_SIGNATURE_FOR_NODE_TYPES,
} from "../../constants/hopr";

const getWeb3SignatureFaucetContents = (hoprAddress, ethAddress) => ({
  hoprAddress,
  ethAddress,
});

const getWeb3SignatureVerifyContents = (hoprSignature, ethAddress) => ({
  hoprSignature,
  ethAddress,
});

const sendSignatureToAPI = async (endpoint, account, signature, message) => {
  const response = await fetch(endpoint, {
    body: JSON.stringify({ signature, message }),
    method: "POST",
    headers: new Headers({
      "Content-Type": "application/json",
      Accept: "application/json",
    }),
  }).then((res) => res.json());
  console.log("SIGNATURE RESPONSE", response);
  return response;
};

const NodeTable = ({ nodes = [], signRequest, copyCodeToClipboard }) => {
  const [isLoading, setLoading] = useState(false);
  const [serverResponse, setServerResponse] = useState("");
  const [transactions, setTransactions] = useState([]);
  return (
    <div className="box-container-table" style={{ height: "100%" }}>
      <table>
        <thead>
          <tr>
            <th>HOPR node</th>
            <th>Ethereum address</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(nodes).map((node) => (
            <tr key={node}>
              <td
                onClick={() => copyCodeToClipboard(node)}
                style={{ cursor: "pointer" }}
              >
                {truncate(node)}
                <img
                  style={{ marginLeft: 8 }}
                  src="/assets/icons/copy.svg"
                  alt="copy"
                />
              </td>
              <td
                onClick={() => copyCodeToClipboard(nodes[node])}
                style={{ cursor: "pointer" }}
              >
                {truncate(nodes[node])}
                <img
                  style={{ marginLeft: 8 }}
                  src="/assets/icons/copy.svg"
                  alt="copy"
                />
              </td>
              <td>
                <button
                  disabled={isLoading}
                  onClick={async () => {
                    setTransactions([]);
                    setServerResponse("");
                    setLoading(true);
                    try {
                      const response =
                        (await signRequest(node, nodes[node])) || {};
                      if (response.status == "ok") {
                        setTransactions(response.transactions);
                      }
                      setServerResponse(response.message);
                      setLoading(false);
                    } catch (e) {
                      setLoading(false);
                    }
                  }}
                >
                  {isLoading ? "Loading.." : "Fund"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {serverResponse.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>transaction</th>
              <th>quantity</th>
              <th>symbol</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <th colSpan="3">{serverResponse}</th>
            </tr>
            {transactions.map((tx, index) => (
              <tr>
                <td
                  onClick={() => copyCodeToClipboard(tx.hash)}
                  style={{ cursor: "pointer" }}
                >
                  {truncate(tx.hash)}
                  <img
                    style={{ marginLeft: 8 }}
                    src="/assets/icons/copy.svg"
                    alt="copy"
                  />
                </td>
                <td>{index == 0 ? "10" : "0.01"}</td>
                <td>{index == 0 ? "mHOPR" : "MATIC"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export const VerifyNode = ({ idx, copyCodeToClipboard }) => {
  const { account, library } = useEthers();
  const [inputValue, setInputValue] = useState();
  const [signatureValue, setSignatureValue] = useState();
  // NB: These would fit better grouped via a reducer
  const [isLoading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");

  const [profile, setProfile] = useState({});
  const [error, setError] = useState();

  const loadIDX = async () => {
    const profile =
      (await idx.get("basicProfile", `${account}@eip155:137`)) || {};
    setProfile(profile);
  };

  const signSignature = async (hoprSignature = "hello world", ethAddress) => {
    const message = getWeb3SignatureVerifyContents(hoprSignature, ethAddress);
    const signature = await library
      .getSigner()
      ._signTypedData(
        HOPR_WEB3_SIGNATURE_DOMAIN,
        HOPR_WEB3_SIGNATURE_FOR_NODE_TYPES,
        message
      );
    const response = await sendSignatureToAPI(
      `/api/sign/verify/${account}`,
      account,
      signature,
      message
    );
    console.log("SERVER RESPONSE", response);
    return response;
  };

  const signRequest = async (hoprAddress, ethAddress) => {
    const message = getWeb3SignatureFaucetContents(hoprAddress, ethAddress);
    const signature = await library
      .getSigner()
      ._signTypedData(
        HOPR_WEB3_SIGNATURE_DOMAIN,
        HOPR_WEB3_SIGNATURE_TYPES,
        message
      );
    const response = await sendSignatureToAPI(
      `/api/faucet/fund/${account}`,
      account,
      signature,
      message
    );
    return response;
  };

  const addHOPRNodeToIDX = async () => {
    // NB: We can’t fully validate HOPR node address until it’s stored in IDX
    // since our hopr-utils had been tailored for node.js and not browser usage.
    if (inputValue.length != HOPR_ADDRESS_CHAR_LENGTH) {
      setError("Invalid HOPR address. Please try with a different value.");
    } else {
      const { alias1 } = CERAMIC_IDX_ALIASES;
      const hoprNodeInfo = { [inputValue]: inputValue };

      setLoading(true);
      setLoadingMessage("Connecting to IDX");
      await idx.set(alias1, { [CERAMIC_IDX_HOPR_NAMESPACE]: hoprNodeInfo });
      setLoadingMessage("Node stored in IDX");

      await new Promise((res) =>
        setTimeout(() => {
          setLoadingMessage("Validating Node in server");
          res();
        }, 1400)
      );

      const response = await fetch(`/api/faucet/nodes/${account}`, {
        body: JSON.stringify({ node: inputValue }),
        method: "POST",
        headers: new Headers({
          "Content-Type": "application/json",
          Accept: "application/json",
        }),
      }).then((res) => res.json());

      if (response.status === "ok") {
        setLoadingMessage("Node is valid. Continuing...");
        await new Promise((res) =>
          setTimeout(() => {
            setLoadingMessage("Updating IDX store.");
            res();
          }, 1600)
        );
        await idx.set(alias1, {
          [CERAMIC_IDX_HOPR_NAMESPACE]: {
            [response.peerId.id]: response.ethAddress,
          },
        });
        setLoadingMessage("IDX store updated.");
      } else {
        setLoadingMessage("Node is invalid. Removing...");
        await idx.set(alias1, {
          [CERAMIC_IDX_HOPR_NAMESPACE]: {
            [inputValue]: "invalid",
          },
        });
      }

      await new Promise((res) =>
        setTimeout(() => {
          setLoadingMessage("Fetching nodes from IDX");
          res();
        }, 1400)
      );
      await loadIDX();
      setLoadingMessage("Profile updated with nodes");
      await new Promise((res) =>
        setTimeout(() => {
          setLoading(false);
          res();
        }, 1600)
      );
    }
  };
  useEffect(() => {
    loadIDX();
  }, []);
  return (
    <div display="flex" style={{ margin: "10px 0" }}>
      <div style={{ marginBottom: "15px" }}>
        <p>
          <b>Add HOPR node</b> {!profile && <span>Loading IDX...</span>}
        </p>
        <small>
          If you have started a HOPR node, you can request funds from our
          faucet. Paste your HOPR node address below, which you can find right
          after starting your node. By clicking “Add HOPR node”, we will
          validate the given node and obtain its address.
        </small>
        <br />
        <br />
        <small>
          To fund, please sign the fund request with your web3 provider to
          validate whether your address and node have MATIC funds already. You
          can fund as many HOPR nodes as needed.
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
            disabled={isLoading}
            style={{
              backgroundColor: "rgba(248, 114, 54, 0.5)",
              marginTop: "5px",
            }}
            onClick={() => {
              addHOPRNodeToIDX();
            }}
          >
            {isLoading ? loadingMessage : "Validate node for funding."}
          </button>
          {error && <small style={{ marginLeft: "5px" }}>{error}</small>}
        </div>
        <NodeTable
          nodes={profile[CERAMIC_IDX_HOPR_NAMESPACE]}
          signRequest={signRequest}
          copyCodeToClipboard={copyCodeToClipboard}
        />
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
            onChange={(e) => setSignatureValue(e.target.value)}
            display="block"
            style={{ width: "98%", padding: "5px" }}
          />
        </div>
        <button
          disabled={!signatureValue}
          onClick={() => {
            signSignature(signatureValue, account);
          }}
          style={{ backgroundColor: "rgba(248, 114, 54, 0.5)" }}
        >
          Verify node for rewards.
        </button>
      </div>
    </div>
  );
};
