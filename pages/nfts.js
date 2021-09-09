import React, { useEffect, useState } from "react";
import Layout from "../components/layout/layout.js";
import BoxRemember from "../components/micro-components/box-remember";
import SearchBar from "../components/micro-components/search-bar";
import { Connectors } from "../components/molecules/Connectors";
import {
  HOPR_WEB3_SIGNATURE_DOMAIN,
  HOPR_WEB3_SIGNATURE_TYPES,
} from "../constants/hopr";
import { truncate } from "../utils/string";
import { useEthers } from "@usedapp/core";
import Link from "next/link";

const getWeb3SignatureEthereumContents = (hoprAddress, ethAddress) => ({
  hoprAddress,
  ethAddress,
});

const Records = ({ account }) => {
  const { library } = useEthers()
  const [records, setRecords] = useState([]);
  const [isPinned, setPinned] = useState(false);
  const [streamId, setStreamId] = useState();

  const loadRecords = async () => {
    const { records, streamId } = await (
      await fetch(`/api/get/${account}`)
    ).json();
    const { isPinned } = await (await fetch(`/api/pin/get/${streamId}`)).json();
    setRecords(records);
    setPinned(isPinned);
    setStreamId(streamId);
  };

  const sendSignatureToAPI = async (endpoint, signature, message) => {
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

  const pinRecord = async (streamId) => {
    await fetch(`/api/pin/${streamId}`);
    await loadRecords();
  };

  const sendSignatureForDeletion = async (signature, message) => {
    const response = await sendSignatureToAPI(
      `/api/sign/delete/${account}`,
      signature,
      message
    );
    return response;
  };

  const getSignatureAndMessage = async (
    hoprAddress,
    ethAddress
  ) => {
    const message = getWeb3SignatureEthereumContents(
      hoprAddress,
      ethAddress
    );
    console.log("SIGNATURE", message, hoprAddress, ethAddress);
    const signature = await library
      .getSigner()
      ._signTypedData(
        HOPR_WEB3_SIGNATURE_DOMAIN,
        HOPR_WEB3_SIGNATURE_TYPES,
        message
      );
      console.log("SIGNATURE", signature);
    return { message, signature };
  };

  const deleteRecord = async (hoprAddress, ethAddress) => {
    const { signature, message } = await getSignatureAndMessage(
      hoprAddress,
      ethAddress
    );
    const signingResponse = await sendSignatureForDeletion(
      signature,
      message
    );
    console.log("SIGNING RESPONSE", signingResponse);
    await loadRecords();
  }

  useEffect(() => {
    account && account.length == 42 && loadRecords();
    return(() => {
      setRecords([]);
      setPinned(false);
      setStreamId(null);
    })
  }, [account]);

  return account ? (
    <div className="box-container-table" style={{ height: "auto" }}>
      <table>
        <thead>
          <tr>
            <th style={{ color: "black" }}>verified nodes</th>
            <th colSpan="2" style={{ color: isPinned ? "green" : "red" }}>
              {isPinned ? (
                "pinned"
              ) : records.length > 0 ? (
                <button onClick={() => pinRecord(streamId)}>pin</button>
              ) : (
                "no nodes"
              )}
            </th>
          </tr>
          <tr>
            <th scope="col">account</th>
            <th scope="col">node</th>
            { library && <th scope="col">action</th> }
          </tr>
        </thead>
        <tbody>
          {records.map((hoprNode, index) => {
            return (
              <tr key={hoprNode}>
                <td data-label="account">{truncate(account)}</td>
                <td data-label="node">{truncate(hoprNode)}</td>
                { library && <td data-label="action"><button onClick={() => deleteRecord(hoprNode, account)}>delete</button></td> }
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  ) : (
    <></>
  );
};

export default function HoprAllocation() {
  const { account } = useEthers();
  const [addressToLoad, setAddressToLoad] = useState("");

  return (
    <Layout>
      <div className="box special-table-top">
        <div className="box-top-area">
          <div>
            <div className="box-title">
              <h1>HOPR NFTs</h1>
            </div>
            {/* <div className="box-btn">
              <button>
                <a
                  className="link-top-blog"
                  target="_blank"
                  href="https://medium.com/hoprnet/hopr-bas%C3%B2dino-a-better-bigger-braver-testnet-97f68e1c9b7e"
                  rel="noopener noreferrer"
                >
                  <img src="/assets/icons/medium.svg" alt="Hopr medium" />
                  learn more
                </a>
              </button>
            </div> */}
          </div>
        </div>
        <SearchBar
          searchTerm={addressToLoad}
          setSearchTerm={setAddressToLoad}
          inputPlaceholder="0x1234..."
          labelMessage="Paste an Ethereum address to see their registered nodes."
        />
        <div className="box-main-area remove-all-padding aux-add-top ">
          <div className="box-main-area">
            <div className="quick-code">
              <small>
                Verify your node to register your on-chain activity. You’ll be
                airdropped an NFT in the xDAI network usable in our staking
                program based on the nodes you register and their on-chain
                activity.
              </small>
              <br />
              <br />
              <small>
                Please make sure to verify your node in our{" "}
                <Link href="/node">node</Link> page to be able to connect your
                node(s) with your Ethereum wallet.
              </small>
            </div>
            <br />
            <Connectors address={account} connectIdx={false} />
          </div>
          <br />
          <Records account={addressToLoad != "" ? addressToLoad : account} />
          <BoxRemember />
        </div>
      </div>
    </Layout>
  );
}
