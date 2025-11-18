"use client";

import { useState, useEffect } from "react";
import styles from "./centerblock.module.css";
import Track from "@/src/components/Track/Track";
import classNames from "classnames";
import Search from "@/src/components/Search/Search";
import { getUniqueValuesByKey } from "@/src/components/utils/helper";
import { useAppSelector, useAppDispatch } from "@/src/components/store/store";
import { getFavoriteTracks } from "@/src/services/tracks/tracksApi";
import { isAuthenticated } from "@/src/services/auth/authApi";
import { setFavoriteTracks } from "@/src/components/store/features/favoritesSlice";

export default function MyPlaylistCenterBlock() {
  const dispatch = useAppDispatch();
  const [showArtistFilter, setShowArtistFilter] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const favoriteTracks = useAppSelector(
    (state) => state.favorites.favoriteTracks
  );
  const artists = getUniqueValuesByKey(favoriteTracks, "author");
  const currentTrack = useAppSelector((state) => state.tracks.currentTrack);
  const isPlaying = useAppSelector((state) => state.tracks.isPlay);

  useEffect(() => {
    loadFavoriteTracks();
  }, []);

  const loadFavoriteTracks = async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      if (!isAuthenticated()) {
        setError("Для просмотра избранных треков необходимо войти в систему");
        return;
      }

      const favorites = await getFavoriteTracks();
      dispatch(setFavoriteTracks(favorites));
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Неизвестная ошибка";
      setError("Ошибка при загрузке избранных треков: " + errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleArtistFilter = (e: React.MouseEvent): void => {
    e.stopPropagation();
    setShowArtistFilter(!showArtistFilter);
  };

  const closeFilter = (): void => {
    setShowArtistFilter(false);
  };

  return (
    <div className={styles.centerblock} onClick={closeFilter}>
      <Search title="" />
      <h2 className={styles.centerblock__h2}>Мой плейлист</h2>
      <div className={styles.centerblock__filter}>
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
                    onClick={(e) => e.stopPropagation()}
                  >
                    {artist}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className={styles.filter__button}>году выпуска</div>
        <div className={styles.filter__button}>жанру</div>
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
          {isLoading ? (
            <div className={styles.emptyPlaylist}>Загрузка...</div>
          ) : error ? (
            <div className={styles.emptyPlaylist}>{error}</div>
          ) : favoriteTracks.length > 0 ? (
            favoriteTracks.map((track) => (
              <Track
                key={track._id}
                track={track}
                isCurrent={currentTrack?._id === track._id}
                isPlaying={isPlaying && currentTrack?._id === track._id}
                playlist={favoriteTracks}
                isLiked={true}
              />
            ))
          ) : (
            <div className={styles.emptyPlaylist}>
              В избранном пока нет треков
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
