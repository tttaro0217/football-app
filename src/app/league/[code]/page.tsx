"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import s from "./page.module.scss";
import c from "../../../components/common.module.scss";
import Header from "../../../components/Header";
import Button from "../../../components/Button";
import ScrollButton from "../../../components/ScrollButton";

type LeagueData = {
  id: number;
  name: string;
  code: string;
  emblem: string;
  area: {
    name: string;
  };
  currentSeason: {
    startDate: string;
    endDate: string;
    winner: {
      name: string;
    };
  };
  type: string;
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
    crest: string;
  };
};

type MatchData = {
  awayTeam: {
    name: string;
    id: number;
    crest: string;
  };
  homeTeam: {
    name: string;
    id: number;
    crest: string;
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
  competition: {
    id: number;
    name: string;
    emblem: string;
  };
  stage: string;
  season: {
    startDate: string;
    endDate: string;
  };
};

type TeamData = {
  name: string;
  id: number;
  crest: string;
};

export default function LeaguePage() {
  const [leagueData, setLeagueData] = useState<LeagueData | null>(null);
  const [teamsData, setTeamsData] = useState<TeamData[]>([]);
  const [scoresDatas, setScoresDatas] = useState<ScoreData[]>([]);
  const [matchesDatas, setMatchesDatas] = useState<MatchData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState<"scores" | "matches" | "teams">(
    "scores"
  );
  const [teamId, setTeamId] = useState<number | null>(null);
  const [personrId, setPersonId] = useState<number | null>(null);
  const [filterMatchId, setFilterMatchId] = useState<number | null>(null);

  const itemsPerPage = 10;
  const { code } = useParams(); // useParamsを使ってパスパラメータを取得

  //フィルターをリセット
  useEffect(() => {
    if (activeTab === "matches") {
      setFilterMatchId(null);
    }
    console.log("フィルターリセット");
  }, [activeTab]);

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
          setMatchesDatas(jsonData.matches.reverse());
        } catch (error) {
          console.error("Error fetching league data:", error);
        }
      }
    }
    fetchMatchesDatas();
  }, [code]);

  const router = useRouter();
  const navigateTeams = (id: number) => {
    setTeamId(id);
    router.push(`/teams/${id}`);
  };
  const navigatePersons = (id: number) => {
    setPersonId(id);
    router.push(`/persons/${id}`);
  };

  const handleFilterTeamChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFilterMatchId(value === "" ? null : parseInt(value));
    setCurrentPage(1); // Reset to the first page when filter changes
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
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

  const filteredMatches = filterMatchId
    ? matchesDatas.filter(
        (match) =>
          match.homeTeam.id === filterMatchId ||
          match.awayTeam.id === filterMatchId
      )
    : matchesDatas;

  const currentMatches = filteredMatches.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredMatches.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleFirstPage = () => {
    setCurrentPage(1);
  };

  const handleTabClick = (tab: "scores" | "matches" | "teams") => {
    setActiveTab(tab);
  };

  const formatDate = (isoDateString: string) => {
    const date = new Date(isoDateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // 月は0から始まるから+1
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0"); // 分を2桁にフォーマット

    return `${year}/${month}/${day} ${hours}:${minutes}`;
  };

  const formatSeason = (startDateString: string, endDateString: string) => {
    const startYear = new Date(startDateString)
      .getFullYear()
      .toString()
      .slice(-2);
    const endYear = new Date(endDateString).getFullYear().toString().slice(-2);
    return `${startYear}/${endYear}`;
  };

  return (
    <>
      <Header></Header>
      <main className={s["leagueDetails"]}>
        <div className={s["title"]}>
          <div className={s["title__emblem"]}>
            <Image src={leagueData.emblem} alt="" width={80} height={80} />
          </div>
          <h2
            className={s["title__text"]}
          >{`${leagueData.name} / ${leagueData.area.name}`}</h2>
        </div>
        <p
          className={s["leagueDetails__season"]}
        >{`シーズン: ${leagueData.currentSeason.startDate} ~ ${leagueData.currentSeason.endDate}`}</p>
        {leagueData.currentSeason.winner ? (
          <p
            className={s["leagueDetails__season"]}
          >{`優勝: ${leagueData.currentSeason.winner.name}`}</p>
        ) : null}
        <div className={s["tabs"]}>
          <Button
            onClick={() => handleTabClick("scores")}
            className={activeTab === "scores" ? c["active"] : ""}
          >
            得点ランキング
          </Button>
          <Button
            onClick={() => handleTabClick("matches")}
            className={activeTab === "matches" ? c["active"] : ""}
          >
            試合結果
          </Button>
          <Button
            onClick={() => handleTabClick("teams")}
            className={activeTab === "teams" ? c["active"] : ""}
          >
            チーム一覧
          </Button>
        </div>

        <div className={s["leagueDetails__content"]}>
          {activeTab === "scores" ? (
            <div>
              <h3>得点ランキング</h3>
              <table className={s["scoresTable"]}>
                <thead>
                  <tr>
                    <th>順位</th>
                    <th>名前</th>
                    <th>チーム</th>
                    <th>ゴール数 (PK数)</th>
                    <th>アシスト数</th>
                    <th>試合数</th>
                  </tr>
                </thead>
                <tbody>
                  {scoresDatas.map((scoresData, index) => (
                    <tr key={scoresData.player.id}>
                      <td>{index + 1}</td>
                      <td>
                        <a
                          className={s["btn"]}
                          onClick={() => navigatePersons(scoresData.player.id)}
                        >
                          {scoresData.player.name}
                        </a>
                      </td>
                      <td
                        className={s["btn"]}
                        onClick={() => navigateTeams(scoresData.team.id)}
                      >
                        <Image
                          src={scoresData.team.crest}
                          alt=""
                          width={30}
                          height={30}
                        />{" "}
                        <p className={s["btn"]}>{scoresData.team.name}</p>
                      </td>
                      <td>{`${scoresData.goals} (${
                        scoresData.penalties ?? 0
                      })`}</td>
                      <td>{scoresData.assists ?? 0}</td>
                      <td>{scoresData.playedMatches}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : activeTab === "matches" ? (
            <div>
              <h3>試合結果</h3>
              <div>
                <label htmlFor="teamFilter">チームでフィルター</label>
                <select
                  id="teamFilter"
                  className={c["filter"]}
                  onChange={handleFilterTeamChange}
                >
                  <option value="">ALL</option>
                  {teamsData.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  ))}
                </select>
              </div>
              <table className={c["matches__table"]}>
                <thead>
                  <tr>
                    <th>日時</th>
                    <th>ホームチーム</th>
                    <th>スコア</th>
                    <th>アウェイチーム</th>
                    {leagueData.type === "CUP" && (
                      <>
                        <th>ステージ</th>
                        <th>グループ</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {currentMatches.map((matchesData) => {
                    return (
                      <tr key={matchesData.id}>
                        <td>{formatDate(matchesData.utcDate)}</td>
                        <td>
                          <div
                            onClick={() =>
                              navigateTeams(matchesData.homeTeam.id)
                            }
                            className={c["matches__teamOuter"]}
                          >
                            <Image
                              src={matchesData.homeTeam.crest}
                              alt=""
                              width={30}
                              height={30}
                            />
                            <p>{matchesData.homeTeam.name}</p>
                          </div>
                        </td>
                        <td>
                          {matchesData.score.fullTime.home}
                          {"-"}
                          {matchesData.score.fullTime.away}
                        </td>
                        <td>
                          <div
                            onClick={() =>
                              navigateTeams(matchesData.awayTeam.id)
                            }
                            className={c["matches__teamOuter"]}
                          >
                            <Image
                              src={matchesData.awayTeam.crest}
                              alt=""
                              width={30}
                              height={30}
                            />
                            <p>{matchesData.awayTeam.name}</p>
                          </div>
                        </td>
                        {leagueData.type === "CUP" && (
                          <>
                            <td>{matchesData.stage}</td>
                            <td>{matchesData.group ?? "-"}</td>
                          </>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <p
                className={c["page__text"]}
              >{`${currentPage}/${totalPages}`}</p>
              <div className={c["pagination"]}>
                <Button
                  onClick={handleFirstPage}
                  disabled={currentPage === 1}
                  className={c["pagination__btn"]}
                >
                  First Page
                </Button>
                <Button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className={c["pagination__btn"]}
                >
                  Previous
                </Button>
                <Button
                  onClick={handleNextPage}
                  disabled={currentPage >= totalPages}
                  className={c["pagination__btn"]}
                >
                  Next
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <h3>チーム一覧</h3>
              <div className={s["teamsGrid"]}>
                {teamsData.map((teamData) => (
                  <div key={teamData.id} className={s["teamItem"]}>
                    <a onClick={() => navigateTeams(teamData.id)}>
                      <Image
                        src={teamData.crest}
                        alt=""
                        width={50}
                        height={50}
                      />
                      <p>{teamData.name}</p>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <ScrollButton onClick={scrollToTop} />
      </main>
    </>
  );
}
