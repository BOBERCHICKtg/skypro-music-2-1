import Bar from "@/src/components/Bar/Bar";
import MainNav from "@/src/components/MainNav/MainNav";
import CenterBlockLayout from "../Center/CenterBlock/CenterBlockLayout";
import Profile from "./Profile";

export default function MyPlaylistPage() {
  return (
    <div className="wrapper">
      <div className="container">
        <main className="main">
          <MainNav />
          <CenterBlockLayout>
            <Profile />
          </CenterBlockLayout>
          <Bar />
        </main>
        <footer className="footer"></footer>
      </div>
    </div>
  );
}
