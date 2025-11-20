"use client";

import { useParams } from "next/navigation";
import Bar from "@/src/components/Bar/Bar";
import MainSidebar from "@/src/components/MainSidebar/MainSidebar";
import MainNav from "@/src/components/MainNav/MainNav";
import SelectionTracksBlock from "../../Center/CenterBlock/SelectionTracksBlock";
import CenterBlockLayout from "../../Center/CenterBlock/CenterBlockLayout";


export default function CategoryPage() {
  const params = useParams<{ id: string }>();

  return (
    <div className="wrapper">
      <div className="container">
        <main className="main">
          <MainNav />
          <CenterBlockLayout>
            <SelectionTracksBlock selectionId={params.id} />
          </CenterBlockLayout>
          <MainSidebar />
          <Bar />
        </main>
        <footer className="footer"></footer>
      </div>
    </div>
  );
}
