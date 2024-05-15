"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import s from "./page.module.scss";

type LeagueData = {
  id: number;
  name: string;
  emblem: string;
  area: {
    name: string;
  };
};

export default function Page() {
  const [leagueListDatas, setLeagueListDatas] = useState<LeagueData[]>([]);

  useEffect(() => {
    async function fetchLeagueList() {
      try {
        const res = await fetch(`/api/leagueList`);
        const jsonData = await res.json();
        console.log(jsonData);
        setLeagueListDatas(jsonData.data.competitions);
        console.log(jsonData.data.competitions[0]);
      } catch (error) {
        console.error("Errorだよ", error);
      }
    }

    fetchLeagueList();
  }, []);

  const getLeagueName = (index: number) => {
    //leagueListDataの番号を取得
    const leagueNumber = index;
    console.log(leagueNumber);
  };

  return (
    <main className={s["leagueLists"]}>
      <div>
        <h2 className={s["leagueLists__title"]}>LEAGUE LIST</h2>
        <ul className={s["leagueLists__items"]}>
          {leagueListDatas.map((leagueListData, index) => (
            <li
              onClick={() => getLeagueName(index)}
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
      <p>{}</p>
    </main>
  );
}
