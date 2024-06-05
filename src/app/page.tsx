//src/app/page.tsx

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import s from "./page.module.scss";
import { useRouter } from "next/navigation";
import Header from "../components/Header";

type LeagueData = {
  id: number;
  name: string;
  code: string;
  emblem: string;
  area: {
    name: string;
  };
};

export default function Page() {
  const [leagueListDatas, setLeagueListDatas] = useState<LeagueData[]>([]);
  const [leagueCode, setLeagueCode] = useState("");

  const router = useRouter();
  const navigateToLeague = (code: string) => {
    setLeagueCode(code);
    router.push(`league/${code}`);
  };

  useEffect(() => {
    async function fetchLeagueList() {
      try {
        const res = await fetch(`/api/leagueList`);
        const jsonData = await res.json();
        setLeagueListDatas(jsonData.data.competitions);
      } catch (error) {
        console.error("Errorだよ", error);
      }
    }
    fetchLeagueList();
  }, []);

  console.log("leagueListDatas", leagueListDatas);
  console.log("leagueCode", leagueCode);

  useEffect(() => {
    async function fetchLeagueData() {
      try {
        const res = await fetch(`/api/league/${leagueCode}`);
        const jsonData = await res.json();
        console.log("Fetched league data:", jsonData);
      } catch (error) {
        console.error("Error fetching league data:", error);
      }
    }
    fetchLeagueData();
  }, [leagueCode]);

  return (
    <>
      <Header></Header>
      <main className={s["leagueLists"]}>
        <div>
          <h2 className={s["leagueLists__title"]}>LEAGUE LIST</h2>
          <ul className={s["leagueLists__items"]}>
            {leagueListDatas.map((leagueListData) => (
              <li
                onClick={() => navigateToLeague(leagueListData.code)}
                key={leagueListData.id}
                className={s["leagueLists__item"]}
              >
                <p className={s["leagueLists__item__name"]}>
                  {leagueListData.name}
                </p>
                <div className={s["leagueLists__item__emblem"]}>
                  <Image
                    src={leagueListData.emblem}
                    alt=""
                    width={60}
                    height={60}
                  />
                </div>
                <p className={s["leagueLists__item__areaName"]}>
                  {leagueListData.area.name}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </>
  );
}
