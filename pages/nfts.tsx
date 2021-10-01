import { useEthers } from "@usedapp/core";
import { useState } from "react";
import SearchBar from "../components/molecules/searchBar";
import Layout from "../components/organisms/layout";
import Link from "next/link";
import { Connectors } from "../components/organisms/connectors";
import Records from "../components/organisms/records";
import BoxRemember from "../components/molecules/boxRemember";
import { NextPage } from "next";

interface HoprAllocationProps {}

const HoprAllocation: NextPage<HoprAllocationProps> = ({}) => {
  const { account } = useEthers();
  const [addressToLoad, setAddressToLoad] = useState<string>("");
  return (
    <Layout>
      <div className="box special-table-top">
        <div className="box-top-area">
          <div className="box-title">
            <h1>HOPR NFTs</h1>
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
          <br/>
          <Records account={addressToLoad != "" ? addressToLoad : account} />
          <BoxRemember leaderboardData={[]}/>
        </div>
      </div>
    </Layout>
  );
};

export default HoprAllocation;
