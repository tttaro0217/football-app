"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import s from "./page.module.scss";

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
  const [leagueData, setLeagueData] = useState(Object);
  const [leagueCode, setLeagueCode] = useState("");

  useEffect(() => {
    async function fetchLeagueList() {
      try {
        const res = await fetch(`/api/leagueList`);
        const jsonData = await res.json();
        console.log(jsonData);
        setLeagueListDatas(jsonData.data.competitions);
      } catch (error) {
        console.error("Errorだよ", error);
      }
    }
    fetchLeagueList();
  }, []);

  console.log(leagueListDatas);
  console.log(leagueData);

  const getLeagueCode = (code: string) => {
    setLeagueCode(code);
  };

  console.log(leagueCode);

  useEffect(() => {
    async function fetchLeagueData() {
      try {
        const res = await fetch(`/api/${leagueCode}`);
        const jsonData = await res.json();
        setLeagueData(jsonData);
      } catch (error) {
        console.error("Errorだよ", error);
      }
    }
    fetchLeagueData();
  }, [leagueCode]);

  return (
    <main className={s["leagueLists"]}>
      <div>
        <h2 className={s["leagueLists__title"]}>LEAGUE LIST</h2>
        <ul className={s["leagueLists__items"]}>
          {leagueListDatas.map((leagueListData) => (
            <li
              onClick={() => getLeagueCode(leagueListData.code)}
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
