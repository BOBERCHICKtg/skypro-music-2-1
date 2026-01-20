"use client";

import "./page.css";
import styles from "./page.module.css";
import Bar from "@/src/components/Bar/Bar";
import MainSidebar from "@/src/components/MainSidebar/MainSidebar";
import MainNav from "@/src/components/MainNav/MainNav";
import CenterBlockLayout from "../Center/CenterBlock/CenterBlockLayout";
import CenterBlock from "../Center/CenterBlock/CenterBlock";
import MyPlaylistCenterBlock from "../Center/CenterBlock/MyPlaylistCenterBlock";

export default function Home() {
  const currentPage = "tracks";

  return (
    <div className={styles.wrapper}>
      <div className={"container"}>
        <main className={"main"}>
          <MainNav />
          <CenterBlockLayout>
            {currentPage === "tracks" ? (
              <CenterBlock />
            ) : (
              <MyPlaylistCenterBlock />
            )}
          </CenterBlockLayout>
          <MainSidebar />
          <Bar />
        </main>
        <footer className="footer"></footer>
      </div>
    </div>
  );
}
