"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./centerblock.module.css";
import { data } from "@/src/data";
import Track from "@/src/components/Track/Track";
import classNames from "classnames";
import Search from "@/src/components/Search/Search";
import { getUniqueValuesByKey } from "@/src/components/utils/helper";
import { useAppSelector } from "@/src/components/store/store";

export default function CenterBlock() {
  const [showArtistFilter, setShowArtistFilter] = useState<boolean>(false);
  const [showYearFilter, setShowYearFilter] = useState<boolean>(false);
  const [showGenreFilter, setShowGenreFilter] = useState<boolean>(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const likedTrackIds = useAppSelector(
    (state) => state.favorites.likedTrackIds
  );

  const artists = getUniqueValuesByKey(data, "author");
  // Добавим примеры годов и жанров (замените на реальные данные из вашего массива data)
  const years = ["2024", "2023", "2022", "2021", "2020"];
  const genres = ["Рок", "Поп", "Хип-хоп", "Электронная", "Джаз"];

  const currentTrack = useAppSelector((state) => state.tracks.currentTrack);
  const isPlaying = useAppSelector((state) => state.tracks.isPlay);

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

  const handleFilterItemClick = (value: string, type: string) => {
    console.log(`Выбран ${type}:`, value);
    // Здесь будет логика фильтрации
    if (type === "artist") {
      setShowArtistFilter(false);
    } else if (type === "year") {
      setShowYearFilter(false);
    } else if (type === "genre") {
      setShowGenreFilter(false);
    }
  };

  return (
    <div className={styles.centerblock}>
      <Search title="" />
      <h2 className={styles.centerblock__h2}>Треки</h2>

      <div className={styles.centerblock__filter} ref={filterRef}>
        <div className={styles.filter__title}>Искать по:</div>

        <div className={styles.filter__buttonWrapper}>
          <div
            className={classNames(styles.filter__button, {
              [styles.active]: showArtistFilter,
            })}
            onClick={toggleArtistFilter}
          >
            исполнителю
            {showArtistFilter && (
              <div className={styles.filter__list}>
                {artists.map((artist: string) => (
                  <div
                    key={artist}
                    className={styles.filter__item}
                    onClick={() => handleFilterItemClick(artist, "artist")}
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
              [styles.active]: showYearFilter,
            })}
            onClick={toggleYearFilter}
          >
            году выпуска
            {showYearFilter && (
              <div className={styles.filter__list}>
                {years.map((year: string) => (
                  <div
                    key={year}
                    className={styles.filter__item}
                    onClick={() => handleFilterItemClick(year, "year")}
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
              [styles.active]: showGenreFilter,
            })}
            onClick={toggleGenreFilter}
          >
            жанру
            {showGenreFilter && (
              <div className={styles.filter__list}>
                {genres.map((genre: string) => (
                  <div
                    key={genre}
                    className={styles.filter__item}
                    onClick={() => handleFilterItemClick(genre, "genre")}
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
          {data.map((track) => (
            <Track
              key={track._id}
              track={track}
              isCurrent={currentTrack?._id === track._id}
              isPlaying={isPlaying && currentTrack?._id === track._id}
              playlist={data}
              isLiked={likedTrackIds.includes(track._id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
