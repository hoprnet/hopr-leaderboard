import type { NextPage } from "next";
import { useEffect, useState } from "react";
import BoxRemember from "../components/molecules/boxRemember";
import Layout from "../components/organisms/layout";
import { twitterRegex } from "../constants/regexExp";
import { columnsDefaults } from "../constants/tablesColumns";
import api from "../utils/api";

export interface HomeProps {}

const Home: NextPage<HomeProps> = ({}) => {
  const [data, setData] = useState<any>(undefined);
  const [showMsg, setShowMsg] = useState<boolean>(false);

  const nodes: any = data ? data.nodes : [];

  const callAPI = () => {
    const fetchData = async () => {
      const response = await api.getAllData();
      if (response.data) {
        let [aNew, aColumns] = fnSortData(
          "openedChannels",
          columnsDefaults,
          response.data
        );
        setData(aNew);
      }
    };
    fetchData();
  };

  const fnSortData = (key: string, aColumns: any, aNew: any) => {
    let sSort = "";

    aColumns.map((item: any) => {
      if (item.key === key) {
        sSort = item.className.replace("sortBy", "").trim();
        sSort = sSort === "asc" ? "desc" : "asc";
      }
      if (item.className !== undefined) {
        item.className = "sortBy";
      }
    });
    aColumns.find((item: any) => item.key === key).className =
      "sortBy " + sSort;

    aNew.nodes = aNew.nodes.sort((a: any, b: any) => {
      let parser = getParser(key),
        convertA = parser(a[key]),
        convertB = parser(b[key]);

      if (sSort === "asc") {
        return convertB - convertA;
      } else {
        return convertA - convertB;
      }
    });

    return [aNew, aColumns];
  };

  const getParser = (key: string | number) => {
    switch (key) {
      case "address":
        return (val: string) => parseInt(val, 16);
      case "id":
        return (val: string) => parseInt(val, 36);
      default:
        return (val: string) => +val;
    }
  };

  useEffect(() => {
    callAPI();
  }, []);

  const trimmedNodesWithUsername = nodes.map((node: any) => {
    const regexedTweet =
      (node.tweetUrl && node.tweetUrl.match(twitterRegex)) || [];
    const username = regexedTweet[1] || "undefined_user";
    const { id } = node;
    return { id, username };
  });

  const sortedTrimmedNodesWithUsername = trimmedNodesWithUsername.sort(
    (a: any, b: any) => b.openedChannels - a.openedChannels
  );

  return (
    <>
      <Layout toggle={showMsg}>
        <div className="box">
          <div className="box-top-area">
            <div>
              <div className="box-title">
                <h1>Network</h1>
              </div>
            </div>
          </div>
          <div className="box-main-area remove-all-padding">
            <div style={{ margin: "20px" }}>
              <p className="help-total-results">
                Please visit our{" "}
                <a
                  href="https://dune.xyz/hoprnet/HOPR-Polygon-Test-Net"
                  target="_blank"
                >
                  Dune dashboard
                </a>{" "}
                to locate and find information about your node.
              </p>
            </div>
            <BoxRemember leaderboardData={sortedTrimmedNodesWithUsername} />
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Home;
