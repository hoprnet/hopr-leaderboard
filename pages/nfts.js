import React, { useEffect, useState } from "react";
import Layout from "../components/layout/layout.js";
import BoxRemember from "../components/micro-components/box-remember";
import { Connectors } from "../components/molecules/Connectors";
import { truncate } from "../utils/string";
import { useEthers } from "@usedapp/core";
import Link from "next/link";

const dataTable = [
  {
    rank: "1",
    address: "0xAAe9F525Ab123801dd2665981E948309DF0b2E20",
    prize: "40,000",
  },
  {
    rank: "2",
    address: "0xAAe9F525Ab123801dd2665981E948309DF0b2E20",
    prize: "20,000",
  },
  {
    rank: "3",
    address: "0xAAe9F525Ab123801dd2665981E948309DF0b2E20",
    prize: "15,000",
  },
  {
    rank: "4",
    address: "0xAAe9F525Ab123801dd2665981E948309DF0b2E20",
    prize: "10,000",
  },
  {
    rank: "5",
    address: "0xAAe9F525Ab123801dd2665981E948309DF0b2E20",
    prize: "7,500",
  },
  {
    rank: "6",
    address: "0xAAe9F525Ab123801dd2665981E948309DF0b2E20",
    prize: "6,000",
  },
  {
    rank: "7",
    address: "0xAAe9F525Ab123801dd2665981E948309DF0b2E20",
    prize: "4,00",
  },
  {
    rank: "8",
    address: "0xAAe9F525Ab123801dd2665981E948309DF0b2E20",
    prize: "3,000",
  },
  {
    rank: "9",
    address: "0xAAe9F525Ab123801dd2665981E948309DF0b2E20",
    prize: "2,500",
  },
  {
    rank: "10",
    address: "0xAAe9F525Ab123801dd2665981E948309DF0b2E20",
    prize: "2,000",
  },
  {
    rank: "11-20",
    address: "0xAAe9F525Ab123801dd2665981E948309DF0b2E20",
    prize: "1,500",
  },
  {
    rank: "21-50",
    address: "0xAAe9F525Ab123801dd2665981E948309DF0b2E20",
    prize: "1,000",
  },
  {
    rank: "51-100",
    address: "0xAAe9F525Ab123801dd2665981E948309DF0b2E20",
    prize: "500",
  },
  {
    rank: "101-200",
    address: "0xAAe9F525Ab123801dd2665981E948309DF0b2E20",
    prize: "200",
  },
];

export default function HoprAllocation() {
  const { account } = useEthers();
  const [records, setRecords] = useState([]);
  useEffect(() => {
    const loadRecords = async () => {
      const { records } = await (await fetch(`/api/sign/get/${account}`)).json();
      setRecords(records);
    };
    account && loadRecords();
  }, [account]);
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
        <div className="box-main-area remove-all-padding aux-add-top ">
          <div className="box-main-area">
            <div className="quick-code">
              <small>
                Verify your node to register your on-chain activity. You’ll
                be airdropped an NFT in the xDAI network usable in our staking
                program based on the nodes you register and their on-chain activity.
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
          {account && (
            <div className="box-container-table" style={{ height: "auto" }}>
              <table>
                <thead>
                  <tr>
                    <th colSpan="2" style={{ color: "black" }}>
                      verified nodes
                    </th>
                  </tr>
                  <tr>
                    <th scope="col">account</th>
                    <th scope="col">node</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((hoprNode, index) => {
                    return (
                      <tr key={hoprNode}>
                        <td data-label="account">{truncate(account)}</td>
                        <td data-label="node">{truncate(hoprNode)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
          <BoxRemember />
        </div>
      </div>
    </Layout>
  );
}
