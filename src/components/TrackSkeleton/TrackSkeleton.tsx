"use client";

import styles from "./trackskeleton.module.css";

export default function TrackSkeleton() {
  return (
    <div className={styles.skeletonTrack}>
      <div className={styles.skeletonTrack__content}>
        <div className={styles.skeletonTrack__title}>
          <div className={styles.skeletonTrack__image}></div>
          <div className={styles.skeletonTrack__text}>
            <div className={styles.skeletonLine}></div>
            <div className={classNames(styles.skeletonLine, styles.short)}></div>
          </div>
        </div>
        <div className={styles.skeletonTrack__author}>
          <div className={styles.skeletonLine}></div>
        </div>
        <div className={styles.skeletonTrack__album}>
          <div className={styles.skeletonLine}></div>
        </div>
        <div className={styles.skeletonTrack__time}>
          <div className={classNames(styles.skeletonLine, styles.time)}></div>
        </div>
      </div>
    </div>
  );
}