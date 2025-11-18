'use client';

import Bar from "@/src/components/Bar/Bar";
import MainSidebar from "@/src/components/MainSidebar/MainSidebar";
import MainNav from "@/src/components/MainNav/MainNav";
import CenterBlockLayout from "../CenterBlock/CenterBlockLayout";
import MyPlaylistCenterBlock from "../CenterBlock/MyPlaylistCenterBlock";

export default function MyPlaylistPage() {
  return (
    <div className="wrapper">
      <div className="container">
        <main className="main">
          <MainNav />
          <CenterBlockLayout>
            <MyPlaylistCenterBlock />
          </CenterBlockLayout>
          <MainSidebar />
          <Bar />
        </main>
        <footer className="footer"></footer>
      </div>
    </div>
  );
}