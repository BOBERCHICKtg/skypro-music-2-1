"use client";

import { ReactNode } from "react";
import styles from "./centerblock.module.css";

type CenterBlockLayoutProps = {
  children: ReactNode;
};

export default function CenterBlockLayout({ children }: CenterBlockLayoutProps) {
  return (
    <div className={styles.centerlayout}>
      {children}
    </div>
  );
}