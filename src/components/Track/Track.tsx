"use client";

import { useAppDispatch, useAppSelector } from "../store/store";
import styles from "@/src/app/music/Center/CenterBlock/centerblock.module.css";
import { TrackType } from "../sharedTypes/types";
import { formatTime } from "../utils/helper";
import {
  setCurrentPlaylist,
  setCurrentTrack,
} from "../store/features/trackSlice";
import Link from "next/link";
import classNames from "classnames";
import { useState, useEffect } from "react";
import {
  addToFavorites,
  removeFromFavorites,
} from "@/src/services/tracks/tracksApi";
import { isAuthenticated } from "@/src/services/auth/authApi";
import {
  addToFavorites as addToFavoritesRedux,
  removeFromFavorites as removeFromFavoritesRedux,
} from "../store/features/favoritesSlice";
import { useRouter } from "next/navigation";

type TrackProps = {
  track: TrackType;
  isCurrent: boolean;
  isPlaying: boolean;
  playlist: TrackType[];
  isLiked?: boolean;
};

export default function Track({
  track,
  isCurrent,
  isPlaying,
  playlist,
  isLiked = false,
}: TrackProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const likedTrackIds = useAppSelector(
    (state) => state.favorites.likedTrackIds
  );
  const [localIsLiked, setLocalIsLiked] = useState<boolean>(isLiked);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setLocalIsLiked(isLiked || likedTrackIds.includes(track._id));
  }, [isLiked, likedTrackIds, track._id]);

  const handleLikeClick = async (e: React.MouseEvent): Promise<void> => {
    e.stopPropagation();

    if (!isAuthenticated()) {
      alert("Для добавления в избранное необходимо войти в систему");
      router.push("/auth/signin");
      return;
    }

    if (isLoading) return;

    setIsLoading(true);
    const originalLikeState = localIsLiked;

    try {
      const newLikeState = !localIsLiked;
      setLocalIsLiked(newLikeState);

      if (newLikeState) {
        await addToFavorites(track._id);
        dispatch(addToFavoritesRedux(track));
      } else {
        await removeFromFavorites(track._id);
        dispatch(removeFromFavoritesRedux(track._id));
      }
    } catch (error: unknown) {
      setLocalIsLiked(originalLikeState);
      const errorMessage =
        error instanceof Error ? error.message : "Неизвестная ошибка";
      alert("Ошибка при изменении избранного: " + errorMessage);
      console.error("Ошибка при изменении избранного:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onClickTrack = (): void => {
    dispatch(setCurrentTrack(track));
    dispatch(setCurrentPlaylist(playlist));
  };

  const onClickTrackRecent = (): void => {
    
  }

  return (
    <div className={styles.playlist__item} onClick={onClickTrack} onClick={onClickTrackRecent}>
      <div className={styles.playlist__track}>
        <div className={styles.track__title}>
          <div className={styles.track__titleImage}>
            {isCurrent ? (
              <div className={styles.track__statusIndicator}>
                <div
                  className={classNames(styles.track__statusDot, {
                    [styles.pulsing]: isPlaying,
                  })}
                />
              </div>
            ) : (
              <svg className={styles.track__titleSvg}>
                <use xlinkHref="/img/icon/sprite.svg#icon-note"></use>
              </svg>
            )}
          </div>
          <div className={styles.track__titleText}>
            <Link className={styles.track__titleLink} href="">
              {track.name} <span className={styles.track__titleSpan}></span>
            </Link>
          </div>
        </div>
        <div className={styles.track__author}>
          <Link className={styles.track__authorLink} href="">
            {track.author}
          </Link>
        </div>
        <div className={styles.track__album}>
          <Link className={styles.track__albumLink} href="">
            {track.album}
          </Link>
        </div>
        <div className={styles.track__time}>
          <svg
            className={styles.track__timeSvg}
            onClick={handleLikeClick}
            style={{
              cursor: isLoading ? "not-allowed" : "pointer",
              fill: localIsLiked ? "#B672FF" : "transparent",
              stroke: localIsLiked ? "#B672FF" : "#696969",
              opacity: isLoading ? 0.5 : 1,
            }}
          >
            <use
              xlinkHref={`/img/icon/sprite.svg#icon-${
                localIsLiked ? "like" : "dislike"
              }`}
            ></use>
          </svg>
          <span className={styles.track__timeText}>
            {formatTime(track.duration_in_seconds)}
          </span>
        </div>
      </div>
    </div>
  );
}
