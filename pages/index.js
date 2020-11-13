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
    {
      title: "score",
      dataIndex: "score",
      key: "score",
      className: "sortBy desc",
    },
    {
      title: "tweetUrl",
      dataIndex: "tweetUrl",
      key: "tweetUrl",
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
  const [searchTerm, setSearchTerm] = useState("");
  const [showMsg, setShowMsg] = useState(false);
  const [match, setMatch] = useState(0);
  const nodesVerified = data ? data.connected.length : 0;
  const nodesRegistered = data ? data.nodes.length : 0;
  const nodesConnected = data ? data.connectedNodes : 0;
  const nodes = data ? data.nodes : [];

  const callAPI = () => {
    const fetchData = async () => {
      const response = await api.getAllData();
      if (response.data) {
        let [aNew, aColumns] = fnSortData(
          "score",
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

  const getIntBase = (key) => {
    switch (key) {
      case "address":
        return 16;
      case "id":
        return 36;
      default:
        return 10;
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
      let iBase = getIntBase(key),
        convertA = parseInt(a[key], iBase),
        convertB = parseInt(b[key], iBase);

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
    setShowMsg(!showMsg);
  };

  const twitterRegex = new RegExp(
    /https?:\/\/twitter\.com\/(?:\#!\/)?(\w+)\/status(es)?\/(\d+)/is
  );

  const trimmedNodesWithUsername = nodes.map((node) => {
    const regexedTweet = node.tweetUrl && node.tweetUrl.match(twitterRegex) || [];
    const username = regexedTweet[1] || "undefined_user";
    const { id, score } = node;
    return { id, username, score };
  });
  const sortedTrimmedNodesWithUsername = trimmedNodesWithUsername.sort(
    (a, b) => b.score - a.score
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
              <h1>Leaderboard</h1>
            </div>
            <div className="box-btn">
              <button onClick={() => callAPI()}>
                <img src="/assets/icons/refresh.svg" alt="refresh now" />
                refresh now
              </button>
            </div>
          </div>
          <div className="only-mobile-view remove-all-padding">
            <SearchBar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              match={match}
            />
          </div>
          <div className="only-desktop-view remove-all-padding ">
            <SuperBoxSearch
              nodesVerified={nodesVerified}
              nodesRegistered={nodesRegistered}
              nodesConnected={nodesConnected}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              match={match}
            />
          </div>
        </div>
        <div className="box-main-area remove-all-padding">
          <div className="box-container-table">
            {nodes && (
              <table id="date">
                <thead>
                  <tr>
                    {columns.map((e) => {
                      const { title, key, className } = e;
                      return (
                        <th
                          className={className}
                          onClick={className ? () => onClickSort(key) : null}
                          scope="col"
                          key={key}
                        >
                          {title}
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {nodes.map((e) => {
                    const { address, id, score, tweetUrl } = e;
                    if (searchTerm.length > 0) {
                      if (
                        address
                          .toLowerCase()
                          .indexOf(searchTerm.toLowerCase()) >= 0 ||
                        id.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0
                      ) {
                        return (
                          <TrCustom
                            id={id}
                            key={id}
                            score={score}
                            address={address}
                            tweetUrl={tweetUrl}
                            showCopyCode={showCopyCode}
                            setVisibleData={setVisibleData}
                          />
                        );
                      }
                    } else {
                      return (
                        <TrCustom
                          id={id}
                          key={id}
                          score={score}
                          address={address}
                          tweetUrl={tweetUrl}
                          showCopyCode={showCopyCode}
                          setVisibleData={setVisibleData}
                        />
                      );
                    }
                  })}
                </tbody>
              </table>
            )}
          </div>
          <BoxRemember leaderboardData={sortedTrimmedNodesWithUsername} />
        </div>
      </div>
    </Layout>
  );
}
