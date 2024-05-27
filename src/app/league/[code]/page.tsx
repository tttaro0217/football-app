"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import s from "./page.module.scss";
import { log } from "console";

type LeagueData = {
  id: number;
  name: string;
  code: string;
  emblem: string;
  area: {
    name: string;
  };
  teams: object;
};

export default function LeaguePage() {
  const [leagueData, setLeagueData] = useState<LeagueData | null>(null);
  const { code } = useParams(); // useParamsを使ってパスパラメータを取得

  useEffect(() => {
    async function fetchLeagueData() {
      if (code) {
        try {
          const res = await fetch(`/api/league/${code}`);
          const jsonData = await res.json();
          setLeagueData(jsonData);
        } catch (error) {
          console.error("Error fetching league data:", error);
        }
      }
    }
    fetchLeagueData();
  }, [code]);

  if (!leagueData) {
    return <p>Loading...</p>;
  }

  console.log("leagueData", leagueData);
  console.log("teams", leagueData.teams);

  return (
    <main className={s["leagueDetails"]}>
      <h1 className={s["leagueDetails__title"]}>{leagueData.name}</h1>
      <div className={s["leagueDetails__emblem"]}>
        <Image src={leagueData.emblem} alt="" width={100} height={100} />
      </div>
      <p className={s["leagueDetails__area"]}>{leagueData.area.name}</p>
    </main>
  );
}
