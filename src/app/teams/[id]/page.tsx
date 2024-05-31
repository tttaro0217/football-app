"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type TeamData = {
  name: string;
};

export default function TeamsPage() {
  const [teamsData, setTeamsData] = useState<TeamData | null>(null);
  const { id } = useParams(); // useParamsを使ってパスパラメータを取得

  useEffect(() => {
    async function fetchTeamsData() {
      if (id) {
        try {
          const res = await fetch(`/api/teams/${id}`);
          const jsonData = await res.json();
          setTeamsData(jsonData);
        } catch (error) {
          console.error("Error fetching league data:", error);
        }
      }
    }
    fetchTeamsData();
  }, [id]);

  console.log(teamsData);

  return (
    <>
      {teamsData ? (
        <>
          <h1>チーム情報</h1>
          <p>{teamsData.name}</p>
        </>
      ) : null}
    </>
  );
}
