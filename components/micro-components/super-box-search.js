import React from "react";

const SuperBoxSearch = ({
  nodesVerified,
  nodesRegistered,
  nodesConnected,
  searchTerm,
  setSearchTerm,
  match,
}) => {
  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };
  return (
    <div className="aux-super-tab">
      <div className="data-form">
        <p className="help-total-results">
          Refer our our{" "}
          <a
            href="https://dune.xyz/hoprnet/HOPR-Polygon-Test-Net"
            target="_blank"
          >
            Dune dashboard
          </a>{" "}
          for a more up-to-date information about your node.
        </p>
        <input
          className="search"
          type="text"
          placeholder="Search by address or ID"
          value={searchTerm}
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

export default SuperBoxSearch;
