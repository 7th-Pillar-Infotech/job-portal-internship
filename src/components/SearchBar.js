import React, { useState } from "react";
import "./SearchBar.css";
import { useDispatch, useSelector } from "react-redux";
import { jobSearch } from "../features/searchSlice";
import { jobSearchWord } from "../features/searchWordSlice";

function SearchBar() {
  const [searchResult, setSearchResult] = useState([]);
  const dispatch = useDispatch();
  const { listings } = useSelector((state) => state.listings);

  const searchInputChangeHandler = (e) => {
    const searchWord = e.target.value.toLowerCase();
    dispatch(jobSearchWord(searchWord));

    let searchResult = listings.filter((obj) => {
      const lowercasedValues = Object.values(obj).map((value) =>
        value.toString().toLowerCase()
      );
      return lowercasedValues.some((value) =>
        value.includes(searchWord.toLowerCase())
      );
    });
    dispatch(jobSearch(searchResult));
    setSearchResult(searchResult);
  };

  console.log(searchResult);

  return (
    <div className="search-bar-div">
      <input
        type="text"
        placeholder="Search for job postings by keyword or location"
        className="search"
        onChange={searchInputChangeHandler}
      ></input>
    </div>
  );
}

export default SearchBar;
