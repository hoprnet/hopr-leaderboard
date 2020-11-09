import React from "react";
import Layout from "../components/layout/layout.js";
import BoxRemember from "../components/micro-components/box-remember";

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
  return (
    <Layout>
      <div className="box special-table-top">
        <div className="box-top-area">
          <div>
            <div className="box-title">
              <h1>Hopr Allocation</h1>
            </div>
            <div className="box-btn">
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
            </div>
          </div>
        </div>
        <div className="box-main-area remove-all-padding aux-add-top ">
          <div className="box-container-table">
            <table>
              <thead>
                <tr>
                  <th scope="col">Rank</th>
                  <th scope="col">User</th>
                  <th scope="col">Prize</th>
                </tr>
              </thead>
              <tbody>
                {dataTable.map((e,index) => {
                  const { rank, address, prize } = e;
                  return (
                    <tr key={rank}>
                      <td data-label="rank" className="notEnum">{rank}</td>
                      <td data-label="user">
                        <a
                          className="table-link-on"
                          target="_blank"
                          href={
                            "https://explorer.matic.network/address/" + address }
                          rel="noopener noreferrer"
                          >
                          <img src="/assets/icons/link.svg" alt="link" />
                          <div>
                            {address.slice(0, 5)}<span>...</span>{address.slice(-5)}
                          </div>
                        </a>
                      </td>
                      <td data-label="prize">{prize}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {/*  */}
          </div>
          <BoxRemember />
        </div>
      </div>
    </Layout>
  );
}
