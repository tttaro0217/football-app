"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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

type ScoreData = {
  assists: number;
  goals: number;
  penalties: number;
  playedMatches: string;
  player: {
    id: number;
    name: string;
  };
  team: {
    name: string;
    id: number;
  };
};

type MatchData = {
  awayTeam: {
    name: string;
    id: number;
  };
  homeTeam: {
    name: string;
    id: number;
  };
  id: number;
  score: {
    winner: string;
    fullTime: {
      home: number;
      away: number;
    };
  };
  utcDate: string;
  group: string;
};

type TeamData = {
  id: number;
};

export default function LeaguePage() {
  const [leagueData, setLeagueData] = useState<LeagueData | null>(null);
  const [teamsData, setTeamsData] = useState<TeamData | null>(null);
  const [scoresDatas, setScoresDatas] = useState<ScoreData[]>([]);
  const [matchesDatas, setMatchesDatas] = useState<MatchData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [teamId, setTeamId] = useState<number | null>(null);
  const [personrId, setPersonId] = useState<number | null>(null);

  const itemsPerPage = 10;
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

  useEffect(() => {
    async function fetchTeamsData() {
      if (code) {
        try {
          const res = await fetch(`/api/league/${code}/teams`);
          const jsonData = await res.json();
          setTeamsData(jsonData.teams);
        } catch (error) {
          console.error("Error fetching league data:", error);
        }
      }
    }
    fetchTeamsData();
  }, [code]);

  useEffect(() => {
    async function fetchScoresDatas() {
      if (code) {
        try {
          const res = await fetch(`/api/league/${code}/scores`);
          const jsonData = await res.json();
          console.log(jsonData);
          setScoresDatas(jsonData.scorers);
        } catch (error) {
          console.error("Error fetching league data:", error);
        }
      }
    }
    fetchScoresDatas();
  }, [code]);

  useEffect(() => {
    async function fetchMatchesDatas() {
      if (code) {
        try {
          const res = await fetch(`/api/league/${code}/matches`);
          const jsonData = await res.json();
          setMatchesDatas(jsonData.matches);
        } catch (error) {
          console.error("Error fetching league data:", error);
        }
      }
    }
    fetchMatchesDatas();
  }, [code]);

  const router = useRouter();
  const navigateTop = () => {
    router.push(`/`);
  };
  const navigateTeams = (id: number) => {
    setTeamId(id);
    router.push(`/teams/${id}`);
  };
  const navigatePersons = (id: number) => {
    setPersonId(id);
    router.push(`/persons/${id}`);
  };

  if (!leagueData) {
    return <p>Loading...</p>;
  }

  console.log("leagueData", leagueData);
  console.log("teamsData", teamsData);
  console.log("scoresDatas", scoresDatas);
  console.log("matchesDatas", matchesDatas);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentMatches = matchesDatas.slice(startIndex, endIndex);

  const handleNextPage = () => {
    if (endIndex < matchesDatas.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (startIndex > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleFirstPage = () => {
    setCurrentPage(1);
  };

  return (
    <main className={s["leagueDetails"]}>
      <h1 className={s["leagueDetails__title"]}>{leagueData.name}</h1>
      <div className={s["leagueDetails__emblem"]}>
        <Image src={leagueData.emblem} alt="" width={100} height={100} />
      </div>
      <p className={s["leagueDetails__area"]}>{leagueData.area.name}</p>
      <button onClick={() => navigateTop()}>TOP</button>
      <div className={s["leagueDetails__content"]}>
        <div>
          <h3>得点ランキング</h3>
          <ul>
            {scoresDatas.map((scoresData) => (
              <li key={scoresData.player.id}>
                <a
                  className={s["btn"]}
                  onClick={() => navigatePersons(scoresData.player.id)}
                >
                  名前：{scoresData.player.name}
                </a>
                <a
                  className={s["btn"]}
                  onClick={() => navigateTeams(scoresData.team.id)}
                >
                  チーム：{scoresData.team.name}
                </a>
                <p>{`ゴール数：${scoresData.goals} (${
                  scoresData.penalties ?? 0
                })`}</p>
                <p>アシスト数：{scoresData.assists}</p>
                <p>試合数：{scoresData.playedMatches}</p>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3>試合結果</h3>
          <ul>
            {currentMatches.map((matchesData) => {
              const winner =
                matchesData.score.winner === "HOME_TEAM"
                  ? matchesData.homeTeam
                  : matchesData.score.winner === "AWAY_TEAM"
                  ? matchesData.awayTeam
                  : null;

              return (
                <li key={matchesData.id}>
                  <div className={s["leagueDetails__versus"]}>
                    <a onClick={() => navigateTeams(matchesData.homeTeam.id)}>
                      {matchesData.homeTeam.name}
                    </a>
                    <p>VS</p>
                    <a onClick={() => navigateTeams(matchesData.awayTeam.id)}>
                      {matchesData.awayTeam.name}
                    </a>
                  </div>
                  {winner ? (
                    <a
                      className={s["btn"]}
                      onClick={() => navigateTeams(winner.id)}
                    >
                      {winner.name}
                    </a>
                  ) : (
                    <p>
                      {matchesData.score.winner === "DRAW"
                        ? "DRAW"
                        : matchesData.utcDate}
                    </p>
                  )}
                  <p>
                    {matchesData.score.fullTime.home}
                    {"-"}
                    {matchesData.score.fullTime.away}
                  </p>
                  <p>{matchesData.group}</p>
                </li>
              );
            })}
          </ul>

          <div className={s["pagination"]}>
            <button
              onClick={handleFirstPage}
              disabled={currentPage === 1}
              className={s["pagination__btn"]}
            >
              First Page
            </button>
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className={s["pagination__btn"]}
            >
              Previous
            </button>
            <button
              onClick={handleNextPage}
              disabled={endIndex >= matchesDatas.length}
              className={s["pagination__btn"]}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
