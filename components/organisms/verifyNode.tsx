import React, { useState, useEffect } from "react";
import { NextPage } from "next";
import { useEthers } from "@usedapp/core";
import { IResponse, IVerifyNodeProfile } from "../../types";
import {
  HOPR_ADDRESS_CHAR_LENGTH,
  HOPR_WEB3_SIGNATURE_DOMAIN,
  HOPR_WEB3_SIGNATURE_FOR_NODE_TYPES,
  HOPR_WEB3_SIGNATURE_TYPES,
} from "../../constants/hopr";
import {
  CERAMIC_IDX_ALIASES,
  CERAMIC_IDX_HOPR_NAMESPACE,
} from "../../constants/ceramic";
import { Inputs } from "../atoms/inputs/inputs";
import { Buttons } from "../atoms/button/buttons";
import NodeTable from "../molecules/nodeTable";
import { IDX } from "@ceramicstudio/idx";

interface VerifyNodeProps {
  idx: IDX;
  copyCodeToClipboard: (text: string) => void;
  sendSignatureToAPI: (
    api: string,
    signature: string,
    message: object
  ) => Promise<IResponse>;
  getWeb3SignatureVerifyContents: (
    hoprAddress: string,
    hoprSignature: string,
    ethAddress: string
  ) => { hoprAddress: string; hoprSignature: string; ethAddress: string };
  getWeb3SignatureFaucetContents: (
    hoprAddress: string,
    ethAddress: string
  ) => { hoprAddress: string; ethAddress: string };
}

export const VerifyNode: NextPage<VerifyNodeProps> = ({
  idx,
  copyCodeToClipboard,
  sendSignatureToAPI,
  getWeb3SignatureVerifyContents,
  getWeb3SignatureFaucetContents,
}) => {
  const { account, library } = useEthers();
  const [inputValue, setInputValue] = useState<string>("");
  const [signatureValue, setSignatureValue] = useState<string>();
  // NB: These would fit better grouped via a reducer
  const [isLoading, setLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>("");

  const [isVerifierLoading, setVerifiedLoading] = useState<boolean>(false);
  const [verifierLoadingMessage, setVerifierLoadingMessage] =
    useState<string>("");

  const [profile, setProfile] = useState<IVerifyNodeProfile>();
  const [error, setError] = useState<string>("");

  const loadIDX = async () => {
    const profile =
      (await idx.get("basicProfile", `${account}@eip155:137`)) || {};
    setProfile(profile as IVerifyNodeProfile);
  };

  const sendSignatureForVerifying = async (
    signature: string,
    message: object
  ) => {
    const response = await sendSignatureToAPI(
      `/api/sign/verify/${account}`,
      signature,
      message
    );
    return response;
  };

  const getSignatureAndMessage = async (
    hoprAddress: string,
    hoprSignature: string,
    ethAddress: string
  ) => {
    const message: object = getWeb3SignatureVerifyContents(
      hoprAddress,
      hoprSignature,
      ethAddress
    );

    const signature = await library!
      .getSigner()
      ._signTypedData(
        HOPR_WEB3_SIGNATURE_DOMAIN,
        HOPR_WEB3_SIGNATURE_FOR_NODE_TYPES,
        message as unknown as Record<string, string>
      );
    return { message, signature };
  };

  const pinStreamId = async (streamId: string) => {
    const response = await (await fetch(`/api/pin/${streamId}`)).json();
    return response;
  };

  const signRequest = async (hoprAddress: string, ethAddress: string) => {
    const message = getWeb3SignatureFaucetContents(hoprAddress, ethAddress);
    const signature = await library!
      .getSigner()
      ._signTypedData(
        HOPR_WEB3_SIGNATURE_DOMAIN,
        HOPR_WEB3_SIGNATURE_TYPES,
        message as unknown as Record<string, string>
      );
    const response = await sendSignatureToAPI(
      `/api/faucet/fund/${account}`,
      signature,
      message
    );
    return response;
  };

  const verifyNodeInCeramic = async (
    hoprAddress: string,
    hoprSignature: string,
    ethAddress: string
  ) => {
    {
      let message;
      setVerifiedLoading(true);
      setVerifierLoadingMessage("Verifying signature and node");
      try {
        const { signature, message } = await getSignatureAndMessage(
          hoprAddress,
          hoprSignature,
          ethAddress
        );
        const signingResponse = await sendSignatureForVerifying(
          signature,
          message
        );
        if (signingResponse.status != "ok") {
          alert(signingResponse.message);
          setVerifiedLoading(false);
          return;
        }
        const nodeStreamId = signingResponse.streamId;
        setVerifierLoadingMessage("Node successfully verified.");

        await new Promise<void>((res) =>
          setTimeout(() => {
            setVerifierLoadingMessage("Pinning node info to Ceramic.");
            res();
          }, 1400)
        );
        await pinStreamId(nodeStreamId);
        setVerifierLoadingMessage("Node info successfully pinned.");

        await new Promise<void>((res) =>
          setTimeout(() => {
            setVerifierLoadingMessage("Storing your node in Dashboard.");
            res();
          }, 1200)
        );

        const dashboardSingingResponse = await sendSignatureToAPI(
          `/api/sign/verify/${account}/dashboard/${nodeStreamId}`,
          signature,
          message
        );
        const dashboardStreamId = dashboardSingingResponse.streamId;
        setVerifierLoadingMessage("Node stored in Dashboard successfully.");

        await new Promise<void>((res) =>
          setTimeout(() => {
            setVerifierLoadingMessage("Pinning dashboard update to Ceramic.");
            res();
          }, 1400)
        );
        await pinStreamId(dashboardStreamId);
        setVerifierLoadingMessage("Dashboard successfully pinned.");
        alert(
          "Process completed, your node has been verified and is now in our records."
        );
        setVerifiedLoading(false);
        return;
      } catch (e) {
        setVerifierLoadingMessage("Something went wrong, try again.");
        await new Promise<void>((res) =>
          setTimeout(() => {
            res();
          }, 1400)
        );
        message = "Server error, please try again later.";
        setVerifiedLoading(false);
      }
      alert(message);
    }
  };

  const addHOPRNodeToIDX = async () => {
    // NB: We can’t fully validate HOPR node address until it’s stored in IDX
    // since our hopr-utils had been tailored for node.js and not browser usage.
    if (inputValue!.length != HOPR_ADDRESS_CHAR_LENGTH) {
      setError("Invalid HOPR address. Please try with a different value.");
    } else {
      const { alias1 } = CERAMIC_IDX_ALIASES;
      const hoprNodeInfo = { [inputValue]: inputValue };

      setLoading(true);
      setLoadingMessage("Connecting to IDX");
      await idx.set(alias1, { [CERAMIC_IDX_HOPR_NAMESPACE]: hoprNodeInfo });
      setLoadingMessage("Node stored in IDX");

      await new Promise<void>((res) =>
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
        await new Promise<void>((res) =>
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

      await new Promise<void>((res) =>
        setTimeout(() => {
          setLoadingMessage("Fetching nodes from IDX");
          res();
        }, 1400)
      );
      await loadIDX();
      setLoadingMessage("Profile updated with nodes");
      await new Promise<void>((res) =>
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
    <div className="verify-node">
      <div className="add-node">
        <p>
          <b>Add HOPR node</b> {!profile && <span>Loading IDX...</span>}
        </p>
        <p>
          If you have started a HOPR node, you can request funds from our
          faucet. Paste your HOPR node address below, which you can find right
          after starting your node. By clicking “Add HOPR node”, we will
          validate the given node and obtain its address.
        </p>
        <br />
        <br />
        <p>
          To fund, please sign the fund request with your web3 provider to
          validate whether your address and node have MATIC funds already. You
          can fund as many HOPR nodes as needed.
        </p>
        <div className="connect-node">
          <Inputs
            type="text"
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="16Uiu2HA..."
            className="connect-node node"
          />
        </div>
        <div className="validate-node">
          <Buttons
            disabled={isLoading}
            onClick={() => {
              addHOPRNodeToIDX();
            }}
            text={isLoading ? loadingMessage : "Validate node for funding."}
          />

          {error && <small className="validate-node error-small">{error}</small>}
        </div>
        <NodeTable
          nodes={profile![CERAMIC_IDX_HOPR_NAMESPACE]}
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
          you control. First, add your HOPR node address in the following input
          value field.
        </small>
        <div className="connect-node">
          <Inputs
            type="text"
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="16Uiu2HA..."
          />
        </div>
        <br />
        <small>
          Now, copy your Ethereum address (the one you want your NFT rewards to
          go to and you can use for signing, usually your MetaMask one) and go
          to the admin interface of your HOPR node. Using the command “sign”,
          sign your copied address and paste the result here. e.g. “sign{" "}
          {account}”
        </small>
        <br />
        <br />
        <small>
          Copy and paste the contents of the sign function in the following text
          field and click on “Verify node for rewards”. If valid, your node will
          then be shown as verified in our network with your Ethereum address.
        </small>
        <div className="connect-node">
          <textarea
            placeholder="0x304402203208f46d1d25c4939760..."
            rows={3}
            onChange={(e) => setSignatureValue(e.target.value)}
          />
        </div>
        <Buttons
          disabled={!signatureValue || isVerifierLoading}
          onClick={async () =>
            verifyNodeInCeramic(
              inputValue.trim(),
              signatureValue!.trim(),
              account!
            )
          }
          className="verifier"
          text={
            isVerifierLoading
              ? verifierLoadingMessage
              : "Verify node for rewards."
          }
        />
      </div>
    </div>
  );
};
