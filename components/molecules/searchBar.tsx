import { NextPage } from "next";
import React, { Dispatch, SetStateAction } from "react";
import { Inputs } from "../atoms/inputs";

export interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: Dispatch<SetStateAction<string>>;
  labelMessage: string;
  inputPlaceholder: string;
}

const SearchBar: NextPage<SearchBarProps> = ({
  searchTerm,
  setSearchTerm,
  labelMessage,
  inputPlaceholder,
}) => {

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="container-search-bar">
      <p className="help-total-results">{labelMessage}</p>
      <Inputs
        className="search"
        type="text"
        placeholder={inputPlaceholder}
        value={searchTerm}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e)}
      />
    </div>
  );
};

export default SearchBar;
