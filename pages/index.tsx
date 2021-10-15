import type { NextPage } from "next";
import { useEffect, useState } from "react";
import BoxRemember from "../components/molecules/boxRemember";
import Layout from "../components/organisms/layout";
import { twitterRegex } from "../constants/regexExp";
import { columnsDefaults } from "../constants/tablesColumns";
import {
  IColumnsDefaults,
  IDataIndex,
  INodeObject,
  ISortedUsername,
  IState,
} from "../types";
import api from "../utils/api";

interface HomeProps {}

const Home: NextPage<HomeProps> = ({}) => {
  const [data, setData] = useState<IDataIndex>();
  const [showMsg, setShowMsg] = useState<boolean>(false);

  const nodes = data ? data.nodes : [];

  const callAPI = () => {
    const fetchData = async () => {
      const response = await api.getAllData();

      if (response.data) {
        let [aNew] = fnSortData(
          "openedChannels",
          columnsDefaults,
          response.data
        );
        setData(aNew as IDataIndex);
      }
    };
    fetchData();
  };

  const fnSortData = (
    key: string,
    aColumns: IColumnsDefaults[],
    aNew: IDataIndex | IColumnsDefaults[] | IState
  ) => {
    let sSort = "";

    aColumns.map((item: { key: string; className: string }) => {
      if (item.key === key) {
        sSort = item.className.replace("sortBy", "").trim();
        sSort = sSort === "asc" ? "desc" : "asc";
      }
      if (item.className !== undefined) {
        item.className = "sortBy";
      }
    });

    aColumns.find((item: { key: string }) => item.key === key)!.className =
      "sortBy " + sSort;

    (aNew as IDataIndex).nodes = ((aNew as IDataIndex).nodes as string[]).sort(
      (a: string, b: string) => {
        let parser = getParser(key),
          convertA = parser(a[key as unknown as number]),
          convertB = parser(b[key as unknown as number]);

        if (sSort === "asc") {
          return convertB - convertA;
        } else {
          return convertA - convertB;
        }
      }
    );

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

  const trimmedNodesWithUsername = (nodes as Array<string>).map(
    (node: string | INodeObject) => {
      const regexedTweet =
        ((node as INodeObject).tweetUrl &&
          (node as INodeObject).tweetUrl.match(twitterRegex)) ||
        [];
      const username = regexedTweet[1] || "undefined_user";
      const { id } = node as INodeObject;
      return { id, username };
    }
  );

  const sortedTrimmedNodesWithUsername = trimmedNodesWithUsername.sort(
    (a: ISortedUsername, b: ISortedUsername) =>
      (b.openedChannels || 0) - (a.openedChannels || 0)
  );

  return (
    <>
      <Layout toggle={showMsg}>
        <div className="box">
          <div className="box-top-area">
              <div>
                <h1>Network</h1>
            </div>
          </div>
          <div className="box-main-area remove-all-padding">
            <div className="info-index"> 
              <p>
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
