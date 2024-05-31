"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type TeamData = {
  name: string;
  currentTeam: {
    name: string;
  };
};

export default function PersonsPage() {
  const [pesonsData, setPesonsData] = useState<TeamData | null>(null);
  const { id } = useParams(); // useParamsを使ってパスパラメータを取得

  useEffect(() => {
    async function fetchPersonsData() {
      if (id) {
        try {
          const res = await fetch(`/api/persons/${id}`);
          const jsonData = await res.json();
          setPesonsData(jsonData);
        } catch (error) {
          console.error("Error fetching league data:", error);
        }
      }
    }
    fetchPersonsData();
  }, [id]);

  console.log(pesonsData);

  return (
    <>
      {pesonsData ? (
        <>
          <h1>チーム情報</h1>
          <p>{pesonsData.name}</p>
          <p>{pesonsData.currentTeam.name}</p>
        </>
      ) : null}
    </>
  );
}
