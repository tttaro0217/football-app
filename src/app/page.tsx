"use client";

import { useEffect, useState } from "react";
import ImageWithFallback from "../components/ImageWithFallback";
import { RiHomeSmileFill } from "react-icons/ri";
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
      <main className={s["container"]}>
        <div>
          <div className={s["container__title"]}>
            <RiHomeSmileFill className={s["container__title__icon"]} />
            <h2 className={s["container__title__text"]}>LEAGUE LIST</h2>
          </div>
          {loadingList ? (
            <p className={`${c["nodata"]}`}>Loading...</p>
          ) : leagueListDatas.length > 0 ? (
            <ul className={s["container__items"]}>
              {leagueListDatas.map((leagueListData) => (
                <li
                  onClick={() => navigateToLeague(leagueListData.code)}
                  key={leagueListData.id}
                  className={s["container__item"]}
                >
                  <p className={s["container__item__name"]}>
                    {leagueListData.name}
                  </p>
                  <div className={s["container__item__emblem"]}>
                    <ImageWithFallback
                      src={leagueListData.emblem}
                      alt={leagueListData.name}
                      width={60}
                      height={60}
                      className={s["responsive-img"]}
                    />
                  </div>
                  <p className={s["container__item__areaName"]}>
                    {leagueListData.area.name}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className={c["nodata"]}>NO DATA</p>
          )}
        </div>
      </main>
      <ScrollButton onClick={scrollToTop} />
    </>
  );
}
