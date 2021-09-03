import React, { useState, useEffect } from "react";
import Layout from "../components/layout/layout.js";
import BoxRemember from "../components/micro-components/box-remember";
import BoxDataTable from "../components/data-view/box-data-table";
import SearchBar from "../components/micro-components/search-bar";
import TrCustom from "../components/micro-components/tr-custom";
import SuperBoxSearch from "../components/micro-components/super-box-search";
import api from "../utils/api";

export default function Home() {
  const columnsDefaults = [
    {
      title: "opened channels",
      dataIndex: "openedChannels",
      key: "openedChannels",
      className: "sortBy desc",
    },
    {
      title: "closed channels",
      dataIndex: "closedChannels",
      key: "closedChannels",
      className: "sortBy desc",
    },
    {
      title: "address",
      dataIndex: "address",
      key: "address",
      className: "sortBy",
    },
    {
      title: "id",
      dataIndex: "id",
      key: "id",
      className: "sortBy",
    },
  ];

  const [data, setData] = useState(undefined);
  const [visibleData, setVisibleData] = useState({
    visible: false,
    position: {},
    pos_page: {},
    data: "",
  });
  const [columns, setColumns] = useState(columnsDefaults);
  const [queriedNode, setQueryNode] = useState();
  const [searchTerm, setSearchTerm] = useState("");
  const [showMsg, setShowMsg] = useState(false);
  const [match, setMatch] = useState(0);
  const nodesVerified = "?";
  const nodesRegistered = "?";
  // const nodesRegistered = data ? data.nodes.length : 0;
  const nodesConnected = "?";
  const nodes = data ? data.nodes : [];

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
        setColumns(aColumns);
        setMatch(response.data.nodes.length);
      }
    };
    fetchData();
  };

  useEffect(() => {
    callAPI();
  }, []);

  useEffect(() => {
    let count = 0;
    const loadNode = async (node) => {
      const response = await (await fetch(`/api/search/${node}`)).json();
      const existingNode = nodes.find((node) => node.id == response.id);
      if (!existingNode) {
        setQueryNode(response);
      }
    };
    // NB: Hopr Node address length
    // e.g. 16Uiu2HAmGg3eQ8wiUHp63qQp831nmYecUrpvGV76JSf1pDUSquAa
    if (searchTerm.length == 53) {
      loadNode(searchTerm);
    }
    if (nodes) {
      if (nodes.length) {
        count = nodes.length;
        if (searchTerm != "" && searchTerm != undefined) {
          let auxcount = nodes.filter(
            (acum) =>
              acum.address.toLowerCase().indexOf(searchTerm.toLowerCase()) >=
                0 ||
              acum.id.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0
          );
          count = auxcount.length;
        }
      }
    }
    setMatch(count);
  }, [searchTerm]);

  const getParser = (key) => {
    switch (key) {
      case "address":
        return (val) => parseInt(val, 16);
      case "id":
        return (val) => parseInt(val, 36);
      default:
        return (val) => +val;
    }
  };

  const fnSortData = (key, aColumns, aNew) => {
    let sSort = "";

    aColumns.map((item) => {
      if (item.key === key) {
        sSort = item.className.replace("sortBy", "").trim();
        sSort = sSort === "asc" ? "desc" : "asc";
      }
      if (item.className !== undefined) {
        item.className = "sortBy";
      }
    });
    aColumns.find((item) => item.key === key).className = "sortBy " + sSort;

    aNew.nodes = aNew.nodes.sort((a, b) => {
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

  const onClickSort = (key) => {
    let [aNew, aColumns] = fnSortData(key, [...columns], { ...data });

    setData(aNew);
    setColumns(aColumns);
  };

  const showCopyCode = () => {
    setShowMsg(true);
    setTimeout(() => {
      setShowMsg(false);
    }, 800);
  };

  const twitterRegex = new RegExp(
    /https?:\/\/twitter\.com\/(?:\#!\/)?(\w+)\/status(es)?\/(\d+)/is
  );

  const trimmedNodesWithUsername = nodes.map((node) => {
    const regexedTweet =
      (node.tweetUrl && node.tweetUrl.match(twitterRegex)) || [];
    const username = regexedTweet[1] || "undefined_user";
    const { id } = node;
    return { id, username };
  });
  const sortedTrimmedNodesWithUsername = trimmedNodesWithUsername.sort(
    (a, b) => b.openedChannels - a.openedChannels
  );

  return (
    <Layout toggle={showMsg}>
      {visibleData.visible && (
        <div
          className="tooltip"
          style={{
            left: visibleData.position.x,
            top: visibleData.position.y,
          }}
        >
          {visibleData.data}
        </div>
      )}
      <div className="only-mobile-view">
        <BoxDataTable
          nodesVerified={nodesVerified}
          nodesRegistered={nodesRegistered}
          nodesConnected={nodesConnected}
        />
      </div>
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
        </p></div>
          <BoxRemember leaderboardData={sortedTrimmedNodesWithUsername} />
        </div>
      </div>
    </Layout>
  );
}
