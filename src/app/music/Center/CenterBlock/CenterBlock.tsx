"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import styles from "./centerblock.module.css";
import { data } from "@/src/data";
import Track from "@/src/components/Track/Track";
import classNames from "classnames";
import Search from "@/src/components/Search/Search";
import { getUniqueValuesByKey } from "@/src/components/utils/helper";
import { useAppSelector } from "@/src/components/store/store";

// Тип для трека (предполагаемая структура)
interface TrackData {
  _id: string;
  name: string;
  author: string;
  album: string;
  release_date?: string;
  genre?: string;
}

export default function CenterBlock() {
  const [showArtistFilter, setShowArtistFilter] = useState<boolean>(false);
  const [showYearFilter, setShowYearFilter] = useState<boolean>(false);
  const [showGenreFilter, setShowGenreFilter] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedArtist, setSelectedArtist] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);

  const filterRef = useRef<HTMLDivElement>(null);
  const likedTrackIds = useAppSelector(
    (state) => state.favorites.likedTrackIds
  );

  const currentTrack = useAppSelector((state) => state.tracks.currentTrack);
  const isPlaying = useAppSelector((state) => state.tracks.isPlay);

  // Извлекаем уникальные значения для фильтров
  const artists = getUniqueValuesByKey(data, "author");

  // Извлекаем годы выпуска (предполагаем, что есть поле release_date)
  const years = useMemo(() => {
    const uniqueYears = new Set<string>();
    data.forEach((track: TrackData) => {
      if (track.release_date) {
        const year = track.release_date.split("-")[0]; // Извлекаем год из даты
        uniqueYears.add(year);
      }
    });
    return Array.from(uniqueYears).sort((a, b) => b.localeCompare(a)); // Сортируем по убыванию
  }, [data]);

  // Извлекаем жанры
  const genres = useMemo(() => {
    const uniqueGenres = new Set<string>();
    data.forEach((track: TrackData) => {
      if (track.genre) {
        uniqueGenres.add(track.genre);
      }
    });
    return Array.from(uniqueGenres).sort();
  }, [data]);

  // Фильтрация треков
  const filteredTracks = useMemo(() => {
    return data.filter((track: TrackData) => {
      // Поиск по запросу
      const matchesSearch =
        searchQuery === "" ||
        track.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        track.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        track.album.toLowerCase().includes(searchQuery.toLowerCase());

      // Фильтр по исполнителю
      const matchesArtist =
        selectedArtist === null || track.author === selectedArtist;

      // Фильтр по году
      const matchesYear =
        selectedYear === null ||
        (track.release_date && track.release_date.startsWith(selectedYear));

      // Фильтр по жанру
      const matchesGenre =
        selectedGenre === null || track.genre === selectedGenre;

      return matchesSearch && matchesArtist && matchesYear && matchesGenre;
    });
  }, [data, searchQuery, selectedArtist, selectedYear, selectedGenre]);

  // Закрытие фильтров при клике вне компонента
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setShowArtistFilter(false);
        setShowYearFilter(false);
        setShowGenreFilter(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleArtistFilter = (e: React.MouseEvent): void => {
    e.stopPropagation();
    setShowArtistFilter(!showArtistFilter);
    setShowYearFilter(false);
    setShowGenreFilter(false);
  };

  const toggleYearFilter = (e: React.MouseEvent): void => {
    e.stopPropagation();
    setShowYearFilter(!showYearFilter);
    setShowArtistFilter(false);
    setShowGenreFilter(false);
  };

  const toggleGenreFilter = (e: React.MouseEvent): void => {
    e.stopPropagation();
    setShowGenreFilter(!showGenreFilter);
    setShowArtistFilter(false);
    setShowYearFilter(false);
  };

  const handleArtistClick = (artist: string) => {
    setSelectedArtist(selectedArtist === artist ? null : artist);
    setShowArtistFilter(false);
  };

  const handleYearClick = (year: string) => {
    setSelectedYear(selectedYear === year ? null : year);
    setShowYearFilter(false);
  };

  const handleGenreClick = (genre: string) => {
    setSelectedGenre(selectedGenre === genre ? null : genre);
    setShowGenreFilter(false);
  };

  // Очистка всех фильтров
  const clearFilters = () => {
    setSelectedArtist(null);
    setSelectedYear(null);
    setSelectedGenre(null);
  };

  // Обработчик поиска
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className={styles.centerblock}>
      {/* Передаем функцию поиска в компонент Search */}
      <Search title="" onSearch={handleSearch} />

      <h2 className={styles.centerblock__h2}>Треки</h2>

      {/* Показываем активные фильтры */}
      {(selectedArtist || selectedYear || selectedGenre) && (
        <div className={styles.activeFilters}>
          <span className={styles.activeFiltersTitle}>Активные фильтры:</span>
          {selectedArtist && (
            <span className={styles.activeFilter}>
              Исполнитель: {selectedArtist}
              <button
                onClick={() => setSelectedArtist(null)}
                className={styles.clearFilterButton}
              >
                ×
              </button>
            </span>
          )}
          {selectedYear && (
            <span className={styles.activeFilter}>
              Год: {selectedYear}
              <button
                onClick={() => setSelectedYear(null)}
                className={styles.clearFilterButton}
              >
                ×
              </button>
            </span>
          )}
          {selectedGenre && (
            <span className={styles.activeFilter}>
              Жанр: {selectedGenre}
              <button
                onClick={() => setSelectedGenre(null)}
                className={styles.clearFilterButton}
              >
                ×
              </button>
            </span>
          )}
          <button onClick={clearFilters} className={styles.clearAllButton}>
            Сбросить все
          </button>
        </div>
      )}

      <div className={styles.centerblock__filter} ref={filterRef}>
        <div className={styles.filter__title}>Искать по:</div>

        <div className={styles.filter__buttonWrapper}>
          <div
            className={classNames(styles.filter__button, {
              [styles.active]: showArtistFilter || selectedArtist,
            })}
            onClick={toggleArtistFilter}
          >
            исполнителю
            {showArtistFilter && (
              <div className={styles.filter__list}>
                {artists.map((artist: string) => (
                  <div
                    key={artist}
                    className={classNames(styles.filter__item, {
                      [styles.selected]: selectedArtist === artist,
                    })}
                    onClick={() => handleArtistClick(artist)}
                  >
                    {artist}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className={styles.filter__buttonWrapper}>
          <div
            className={classNames(styles.filter__button, {
              [styles.active]: showYearFilter || selectedYear,
            })}
            onClick={toggleYearFilter}
          >
            году выпуска
            {showYearFilter && (
              <div className={styles.filter__list}>
                {years.map((year: string) => (
                  <div
                    key={year}
                    className={classNames(styles.filter__item, {
                      [styles.selected]: selectedYear === year,
                    })}
                    onClick={() => handleYearClick(year)}
                  >
                    {year}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className={styles.filter__buttonWrapper}>
          <div
            className={classNames(styles.filter__button, {
              [styles.active]: showGenreFilter || selectedGenre,
            })}
            onClick={toggleGenreFilter}
          >
            жанру
            {showGenreFilter && (
              <div className={styles.filter__list}>
                {genres.map((genre: string) => (
                  <div
                    key={genre}
                    className={classNames(styles.filter__item, {
                      [styles.selected]: selectedGenre === genre,
                    })}
                    onClick={() => handleGenreClick(genre)}
                  >
                    {genre}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={styles.centerblock__content}>
        <div className={styles.content__title}>
          <div className={classNames(styles.playlistTitle__col, styles.col01)}>
            Трек
          </div>
          <div className={classNames(styles.playlistTitle__col, styles.col02)}>
            Исполнитель
          </div>
          <div className={classNames(styles.playlistTitle__col, styles.col03)}>
            Альбом
          </div>
          <div className={classNames(styles.playlistTitle__col, styles.col04)}>
            <svg className={styles.playlistTitle__svg}>
              <use xlinkHref="/img/icon/sprite.svg#icon-watch"></use>
            </svg>
          </div>
        </div>
        <div className={styles.content__playlist}>
          {filteredTracks.length > 0 ? (
            filteredTracks.map((track: TrackData) => (
              <Track
                key={track._id}
                track={track}
                isCurrent={currentTrack?._id === track._id}
                isPlaying={isPlaying && currentTrack?._id === track._id}
                playlist={filteredTracks}
                isLiked={likedTrackIds.includes(track._id)}
              />
            ))
          ) : (
            <div className={styles.noResults}>
              По вашему запросу ничего не найдено
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
