"use client";

import { useState, useEffect } from "react";
import styles from "./centerblock.module.css";
import Track from "@/src/components/Track/Track";
import classNames from "classnames";
import Search from "@/src/components/Search/Search";
import { getUniqueValuesByKey } from "@/src/components/utils/helper";
import { useAppSelector } from "@/src/components/store/store";
import {
  getSelectionTracks,
  getSelectionById,
} from "@/src/services/tracks/tracksApi";
import { TrackType } from "@/src/components/sharedTypes/types";

interface SelectionTracksBlockProps {
  selectionId: string;
}

export default function SelectionTracksBlock({
  selectionId,
}: SelectionTracksBlockProps) {
  const [showArtistFilter, setShowArtistFilter] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [tracks, setTracks] = useState<TrackType[]>([]);
  const [selectionName, setSelectionName] = useState<string>("Подборка");

  const likedTrackIds = useAppSelector(
    (state) => state.favorites.likedTrackIds
  );
  const currentTrack = useAppSelector((state) => state.tracks.currentTrack);
  const isPlaying = useAppSelector((state) => state.tracks.isPlay);

  useEffect(() => {
    loadSelectionData();
  }, [selectionId]);

  const loadSelectionData = async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      const selectionData = await getSelectionById(selectionId);

      if (selectionData && selectionData.name) {
        setSelectionName(selectionData.name);
      } else {
        setSelectionName("Подборка");
      }

      const selectionTracks = await getSelectionTracks(selectionId);
      setTracks(selectionTracks);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Неизвестная ошибка";
      setError(`Ошибка при загрузке подборки: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleArtistFilter = (event: React.MouseEvent): void => {
    event.stopPropagation();
    setShowArtistFilter(!showArtistFilter);
  };

  const closeFilter = (): void => {
    setShowArtistFilter(false);
  };

  const renderArtistFilter = (): JSX.Element | null => {
    if (!showArtistFilter) return null;

    const artists = getUniqueValuesByKey(tracks, "author");

    return (
      <div className={styles.filter__list}>
        {artists.map((artist: string) => (
          <div
            key={artist}
            className={styles.filter__item}
            onClick={(event) => event.stopPropagation()}
          >
            {artist}
          </div>
        ))}
      </div>
    );
  };

  const renderPlaylistHeader = (): JSX.Element => (
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
  );

  const renderPlaylistContent = (): JSX.Element => {
    if (isLoading) {
      return <div className={styles.emptyPlaylist}>Загрузка подборки...</div>;
    }

    if (error) {
      return <div className={styles.emptyPlaylist}>{error}</div>;
    }

    if (tracks.length === 0) {
      return (
        <div className={styles.emptyPlaylist}>
          В этой подборке пока нет треков
        </div>
      );
    }

    return (
      <>
        {tracks.map((track) => (
          <Track
            key={track._id}
            track={track}
            isCurrent={currentTrack?._id === track._id}
            isPlaying={isPlaying && currentTrack?._id === track._id}
            playlist={tracks}
            isLiked={likedTrackIds.includes(track._id)}
          />
        ))}
      </>
    );
  };

  return (
    <div className={styles.centerblock} onClick={closeFilter}>
      <Search title="" />
      <h2 className={styles.centerblock__h2}>{selectionName}</h2>
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
            {renderArtistFilter()}
          </div>
        </div>
        <div className={styles.filter__button}>году выпуска</div>
        <div className={styles.filter__button}>жанру</div>
      </div>
      <div className={styles.centerblock__content}>
        {renderPlaylistHeader()}
        <div className={styles.content__playlist}>
          {renderPlaylistContent()}
        </div>
      </div>
    </div>
  );
}
