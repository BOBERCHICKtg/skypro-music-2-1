"use client";

import { useState, useEffect, useCallback } from "react";
import styles from "./search.module.css";

type SearchProps = {
  title: string;
  onSearch: (query: string) => void;
  debounceDelay?: number; 
};

export default function Search({
  title,
  onSearch,
  debounceDelay = 300,
}: SearchProps) {
  const [searchInput, setSearchInput] = useState("");


  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchInput);
    }, debounceDelay);

    return () => {
      clearTimeout(timer);
    };
  }, [searchInput, onSearch, debounceDelay]);

  const onSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };


  return (
    <div className={styles.centerblock__search}>
      <svg className={styles.search__svg}>
        <use xlinkHref="/img/icon/sprite.svg#icon-search"></use>
      </svg>
      {title}
      <input
        className={styles.search__text}
        type="search"
        placeholder="Поиск"
        name="search"
        value={searchInput}
        onChange={onSearchInput}
      />
    </div>
  );
}
