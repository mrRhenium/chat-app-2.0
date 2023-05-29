"use client";

import style from "../../../styles/Search.module.css";
import LoadingComponent from "@/components/LoadingComponent";
import SearchItemComponent from "@/components/SearchItemComponent";

import { useState } from "react";
import useSWR from "swr";

import { BiSearchAlt2 } from "react-icons/bi";
//
//

// Define the Fetcher and URL of the server route
const URL = `/api/search`;
const fetcher = async (url) => {
  const res = await fetch(url);
  const data = await res.json();
  return data;
};

const Search = () => {
  const { data, isLoading, mutate } = useSWR(URL, fetcher, {
    refreshInterval: 2000,
  });
  const [list, set_list] = useState([]);

  //
  let searchItemSetInterval;
  const searchUsers = async () => {
    clearTimeout(searchItemSetInterval);

    let searchItem = searchInput.value.trim();
    const JSONdata = JSON.stringify({ search: searchItem });

    searchItemSetInterval = setTimeout(async () => {
      //

      const res = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSONdata,
      });

      const resData = await res.json();

      if (resData.status === false) alert(`${resData.msg}`);
      else set_list(resData.data);

      // console.log("Successful", resData);
    }, 2000);
  };

  //
  return (
    <>
      {/* Search Page : Header Componenet Start here */}
      <section className={style.header}>
        <form>
          <label htmlFor="searchInput">
            <BiSearchAlt2 className={style.icons} />
            <input
              type="search"
              name="searchInput"
              id="searchInput"
              placeholder="search..."
              autoComplete="off"
              autoFocus
              onChange={() => searchUsers()}
            />
          </label>
        </form>
      </section>
      {/* Search Page : Header Componenet Start here */}

      {/* Search Page : Body Componenet Start here */}
      <section className={style.body}>
        <div className={style.searchItem_cover}>
          {isLoading ? (
            <LoadingComponent />
          ) : (
            <SearchItemComponent
              list={list.length ? list : data["data"]}
              mutate={mutate}
            />
          )}
        </div>
      </section>
      {/* Search Page : Body Componenet End here */}
    </>
  );
};

export default Search;
