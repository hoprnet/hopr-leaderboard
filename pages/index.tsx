import type { NextPage } from "next";
import { useState, useEffect } from "react";
import BoxRemember from "../components/molecules/boxRemember";
import DataBoxTable from "../components/molecules/dataBoxTable";
import Layout from "../components/organisms/layout";
import { twitterRegex } from "../constants/regexExp";
import { columnsDefaults } from "../constants/tablesColumns";
import { IVisibleData } from "../types";
import api from "../utils/api";

export interface HomeProps {}

const Home: NextPage<HomeProps> = ({}) => {
  const [data, setData] = useState<any>(undefined);
  /* const [visibleData, setVisibleData] = useState<IVisibleData>({
    visible: false,
    position: { x: 0, y: 0 },
    os_page: {},
    data: "",
  }); */
  /* const [columns, setColumns] = useState<object>(columnsDefaults); */
  /* const [queriedNode, setQueryNode] = useState<any>(); */
  /* const [searchTerm, setSearchTerm] = useState<string>(""); */
  const [showMsg, setShowMsg] = useState<boolean>(false);
  /* const [match, setMatch] = useState<number>(0); */

  /* const nodesVerified: string = "?";
  const nodesRegistered: string = "?";
  const nodesConnected: string = "?"; */
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
        /* setColumns(aColumns); */
        /* setMatch(response.data.nodes.length); */
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

/*   const loadNode = async (node: any) => {
    const response: any = await (await fetch(`/api/search/${node}`)).json();
    const existingNode: any = nodes.find((node: any) => node.id == response.id);
    if (!existingNode) {
      setQueryNode(response);
    }
  }; */

 /*  const updateMatch = () => {
    let count: number = 0;
    if (nodes) {
      if (nodes.length) {
        count = nodes.length;
        if (searchTerm != "" && searchTerm != undefined) {
          let auxcount: any = nodes.filter(
            (acum: any) =>
              acum.address.toLowerCase().indexOf(searchTerm.toLowerCase()) >=
                0 ||
              acum.id.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0
          );
          count = auxcount.length;
        }
      }
    }
    setMatch(count); 
  }; */

/*   useEffect(() => {
    if (searchTerm.length == 53) {
      loadNode(searchTerm);
    }
    updateMatch();
  }, [searchTerm]); */

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
