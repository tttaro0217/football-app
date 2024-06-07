"use client";

import { useEffect, useState } from "react";
import ImageWithFallback from "../components/ImageWithFallback";
import s from "./page.module.scss";
import c from "../components/common.module.scss";
import { useRouter } from "next/navigation";
import Header from "../components/Header";
import ScrollButton from "../components/ScrollButton";

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
  const [loadingList, setLoadingList] = useState(true);
  const [loadingCode, setLoadingCode] = useState(false);

  const router = useRouter();
  const navigateToLeague = (code: string) => {
    setLeagueCode(code);
    router.push(`league/${code}`);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    async function fetchLeagueList() {
      try {
        const res = await fetch(`/api/leagueList`);
        if (!res.ok) throw new Error("Failed to fetch league list");
        const jsonData = await res.json();
        setLeagueListDatas(jsonData.data.competitions || []);
        setLoadingList(false);
      } catch (error) {
        console.error("Error fetching league list:", error);
        setLoadingList(false);
      }
    }
    fetchLeagueList();
  }, []);

  useEffect(() => {
    if (!leagueCode) return;

    async function fetchLeagueCode() {
      try {
        setLoadingCode(true);
        const res = await fetch(`/api/league/${leagueCode}`);
        if (!res.ok) throw new Error("Failed to fetch league data");
        const jsonData = await res.json();
        console.log("Fetched league data:", jsonData);
        setLoadingCode(false);
      } catch (error) {
        console.error("Error fetching league data:", error);
        setLoadingCode(false);
      }
    }
    fetchLeagueCode();
  }, [leagueCode]);

  return (
    <>
      <Header />
      <main className={s["leagueLists"]}>
        <div>
          <h2 className={s["leagueLists__title"]}>LEAGUE LIST</h2>
          {loadingList ? (
            <p className={`${c["nodata"]}`}>Loading...</p>
          ) : leagueListDatas.length > 0 ? (
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
                    <ImageWithFallback
                      src={leagueListData.emblem}
                      alt={leagueListData.name}
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
          ) : (
            <p className={s["nodata"]}>NO DATA</p>
          )}
        </div>
      </main>
      <ScrollButton onClick={scrollToTop} />
    </>
  );
}
