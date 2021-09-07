import React from "react";

const SearchBar = ({
  searchTerm,
  setSearchTerm,
  match,
  labelMessage = "Paste your address to search for nodes.",
  inputPlaceholder = "Search by address or ID",
}) => {
  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };
  return (
    <div className="container-search-bar">
      <p className="help-total-results">{labelMessage}</p>
      <input
        className="search"
        type="text"
        placeholder={inputPlaceholder}
        value={searchTerm}
        onChange={handleChange}
      />
    </div>
  );
};

export default SearchBar;
