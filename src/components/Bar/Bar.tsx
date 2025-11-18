"use client";

import Link from "next/link";
import styles from "./bar.module.css";
import classNames from "classnames";
import { useAppDispatch, useAppSelector } from "../store/store";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import {
  setIsPlaying,
  setNextTrack,
  setPrevTrack,
  toggleShuffle,
} from "../store/features/trackSlice";
import ProgressBar from "../ProgressBar/ProgressBar";
import { addToFavorites, removeFromFavorites } from "@/src/services/tracks/tracksApi";
import { isAuthenticated } from "@/src/services/auth/authApi";
import { addToFavorites as addToFavoritesRedux, removeFromFavorites as removeFromFavoritesRedux } from "../store/features/favoritesSlice";
import { useRouter } from "next/navigation";

export default function Bar() {
  const currentTrack = useAppSelector((state) => state.tracks.currentTrack);
  const isPlaying = useAppSelector((state) => state.tracks.isPlay);
  const isShuffle = useAppSelector((state) => state.tracks.isShuffle);
  const likedTrackIds = useAppSelector((state) => state.favorites.likedTrackIds);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [isLoop, setIsLoop] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isLoadedTrack, setIsLoadedTrack] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isLocalPlaying, setIsLocalPlaying] = useState(false);
  const [isLikeLoading, setIsLikeLoading] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Основной эффект для управления воспроизведением при смене трека
  useEffect(() => {
    if (currentTrack && audioRef.current) {
      setIsLoadedTrack(false);
      setCurrentTime(0);
      
      // Перезагружаем аудио элемент с новым треком
      audioRef.current.load();
      
      // Если трек должен играть, запускаем его после загрузки метаданных
      const handleLoadedMetadata = () => {
        setIsLoadedTrack(true);
        if (isPlaying) {
          audioRef.current?.play().then(() => {
            setIsLocalPlaying(true);
          }).catch((error: Error) => {
            console.error("Ошибка воспроизведения при загрузке:", error);
          });
        }
      };

      audioRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
      
      return () => {
        audioRef.current?.removeEventListener('loadedmetadata', handleLoadedMetadata);
      };
    }
  }, [currentTrack]);

  // Эффект для синхронизации состояния воспроизведения
  useEffect(() => {
    if (audioRef.current && isLoadedTrack) {
      if (isPlaying && !isLocalPlaying) {
        audioRef.current.play().then(() => {
          setIsLocalPlaying(true);
        }).catch((error: Error) => {
          console.error("Ошибка воспроизведения:", error);
        });
      } else if (!isPlaying && isLocalPlaying) {
        audioRef.current.pause();
        setIsLocalPlaying(false);
      }
    }
  }, [isPlaying, isLocalPlaying, isLoadedTrack]);

  const handleLikeClick = async (): Promise<void> => {
    if (!currentTrack || !isAuthenticated()) {
      alert('Для добавления в избранное необходимо войти в систему');
      router.push('/auth/signin');
      return;
    }
    
    if (isLikeLoading) return;
    
    setIsLikeLoading(true);
    
    try {
      const isLiked = likedTrackIds.includes(currentTrack._id);
      
      if (isLiked) {
        await removeFromFavorites(currentTrack._id);
        dispatch(removeFromFavoritesRedux(currentTrack._id));
      } else {
        await addToFavorites(currentTrack._id);
        dispatch(addToFavoritesRedux(currentTrack));
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
      alert('Ошибка при изменении избранного: ' + errorMessage);
      console.error('Ошибка при изменении избранного:', error);
    } finally {
      setIsLikeLoading(false);
    }
  };

  const togglePlayPause = (): void => {
    if (audioRef.current && isLoadedTrack) {
      if (isLocalPlaying) {
        audioRef.current.pause();
        dispatch(setIsPlaying(false));
        setIsLocalPlaying(false);
      } else {
        audioRef.current.play().then(() => {
          dispatch(setIsPlaying(true));
          setIsLocalPlaying(true);
        }).catch((error: Error) => {
          console.error("Ошибка воспроизведения:", error);
        });
      }
    }
  };

  const onToggleLoop = (): void => {
    setIsLoop(!isLoop);
  };

  const onTimeUpdate = (): void => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const onLoadMetadata = (): void => {
    if (audioRef.current) {
      setIsLoadedTrack(true);
    }
  };

  const onChangeProgress = (e: ChangeEvent<HTMLInputElement>): void => {
    if (audioRef.current && isLoadedTrack) {
      const inputTime = Number(e.target.value);
      audioRef.current.currentTime = inputTime;
      setCurrentTime(inputTime);
    }
  };

  const onNextTrack = (): void => {
    dispatch(setNextTrack());
  };

  const onPrevTrack = (): void => {
    dispatch(setPrevTrack());
  };

  const onToggleShuffle = (): void => {
    dispatch(toggleShuffle());
  };

  const handleEnded = (): void => {
    setIsLocalPlaying(false);
    dispatch(setIsPlaying(false));
    
    if (!isLoop) {
      dispatch(setNextTrack());
    }
  };

  const handleNotImplemented = (): void => {
    alert("Еще не реализовано");
  };

  if (!currentTrack) return null;

  const isCurrentTrackLiked = currentTrack && likedTrackIds.includes(currentTrack._id);

  return (
    <div className={styles.bar}>
      {currentTrack && currentTrack.track_file && (
        <audio
          ref={audioRef}
          src={currentTrack.track_file}
          onEnded={handleEnded}
          loop={isLoop}
          onTimeUpdate={onTimeUpdate}
          onLoadedMetadata={onLoadMetadata}
          preload="metadata"
        />
      )}

      <ProgressBar
        max={audioRef.current?.duration || 0}
        step={0.1}
        readOnly={!isLoadedTrack}
        value={currentTime}
        onChange={onChangeProgress}
      />

      <div className={styles.bar__content}>
        <div className={styles.bar__playerBlock}>
          <div className={styles.bar__player}>
            <div className={styles.player__controls}>
              <div className={styles.player__btnPrev} onClick={onPrevTrack}>
                <svg className={styles.player__btnPrevSvg}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-prev"></use>
                </svg>
              </div>

              <div
                className={classNames(styles.player__btnPlay, styles.btn)}
                onClick={togglePlayPause}
              >
                <svg className={styles.player__btnPlaySvg}>
                  <use
                    xlinkHref={
                      isLocalPlaying
                        ? "/img/icon/sprite.svg#icon-pause"
                        : "/img/icon/sprite.svg#icon-play"
                    }
                  />
                </svg>
              </div>

              <div className={styles.player__btnNext} onClick={onNextTrack}>
                <svg className={styles.player__btnNextSvg}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-next"></use>
                </svg>
              </div>

              <div
                className={classNames(styles.player__btnRepeat, styles.btnIcon, {
                  [styles.player__btnRepeatActive]: isLoop,
                })}
                onClick={onToggleLoop}
              >
                <svg className={styles.player__btnRepeatSvg}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-repeat"></use>
                </svg>
              </div>

              <div
                className={classNames(
                  styles.player__btnShuffle,
                  styles.btnIcon,
                  {
                    [styles.player__btnShuffleActive]: isShuffle,
                  }
                )}
                onClick={onToggleShuffle}
              >
                <svg className={styles.player__btnShuffleSvg}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-shuffle"></use>
                </svg>
              </div>
            </div>

            <div className={styles.player__trackPlay}>
              <div className={styles.trackPlay__contain}>
                <div className={styles.trackPlay__image}>
                  <svg className={styles.trackPlay__svg}>
                    <use xlinkHref="/img/icon/sprite.svg#icon-note"></use>
                  </svg>
                </div>
                <div className={styles.trackPlay__author}>
                  <Link className={styles.trackPlay__authorLink} href="">
                    {currentTrack.author}
                  </Link>
                </div>
                <div className={styles.trackPlay__album}>
                  <Link className={styles.trackPlay__albumLink} href="">
                    {currentTrack.album}
                  </Link>
                </div>
              </div>

              <div className={styles.trackPlay__likeDislike}>
                <div
                  className={classNames(styles.trackPlay__like, {
                    [styles.trackPlay__likeActive]: isCurrentTrackLiked,
                    [styles.trackPlay__likeLoading]: isLikeLoading,
                  })}
                  onClick={handleLikeClick}
                  style={{ opacity: isLikeLoading ? 0.5 : 1 }}
                >
                  <svg className={styles.trackPlay__likeSvg}>
                    <use xlinkHref="/img/icon/sprite.svg#icon-like"></use>
                  </svg>
                </div>
                <div
                  className={styles.trackPlay__dislike}
                  onClick={handleNotImplemented}
                >
                  <svg className={styles.trackPlay__dislikeSvg}>
                    <use xlinkHref="/img/icon/sprite.svg#icon-dislike"></use>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.bar__volumeBlock}>
            <div className={styles.volume__content}>
              <div className={styles.volume__image}>
                <svg className={styles.volume__svg}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-volume"></use>
                </svg>
              </div>
              <div className={classNames(styles.volume__progress, styles.btn)}>
                <input
                  className={classNames(
                    styles.volume__progressLine,
                    styles.btn
                  )}
                  type="range"
                  name="range"
                  value={volume * 100}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    const newVolume = Number(e.target.value) / 100;
                    setVolume(newVolume);
                    if (audioRef.current) {
                      audioRef.current.volume = newVolume;
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}