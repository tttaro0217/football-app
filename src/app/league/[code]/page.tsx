"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { GiChampions } from "react-icons/gi";
import ImageWithFallback from "../../../components/ImageWithFallback";
import s from "./page.module.scss";
import c from "../../../components/common.module.scss";
import Header from "../../../components/Header";
import Button from "../../../components/Button";
import ScrollButton from "../../../components/ScrollButton";
import { Duplex } from "stream";

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
      crest: string;
    } | null;
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
  const [loadingLeague, setLoadingLeague] = useState(true);
  const [loadingTeams, setLoadingTeams] = useState(true);
  const [loadingScores, setLoadingScores] = useState(true);
  const [loadingMatches, setLoadingMatches] = useState(true);

  const [isReversed, setIsReversed] = useState<boolean>(false);

  const itemsPerPage = 10;
  const { code } = useParams(); // useParamsを使ってパスパラメータを取得

  //フィルターをリセット
  useEffect(() => {
    if (activeTab === "matches") {
      setFilterMatchId(null);
    }
  }, [activeTab]);

  useEffect(() => {
    async function fetchLeagueData() {
      if (code) {
        try {
          const res = await fetch(`/api/league/${code}`);
          const jsonData = await res.json();
          setLeagueData(jsonData);
          setLoadingLeague(false);
        } catch (error) {
          console.error("Error fetching league data:", error);
          setLoadingLeague(false);
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
          setTeamsData(jsonData.teams || []);
          setLoadingTeams(false);
        } catch (error) {
          console.error("Error fetching teams data:", error);
          setLoadingTeams(false);
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
          setScoresDatas(jsonData.scorers || []);
          setLoadingScores(false);
        } catch (error) {
          console.error("Error fetching scores data:", error);
          setLoadingScores(false);
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
          setMatchesDatas(jsonData.matches || []);
          setLoadingMatches(false);
        } catch (error) {
          console.error("Error fetching matches data:", error);
          setLoadingMatches(false);
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

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const filteredMatches = filterMatchId
    ? matchesDatas.filter(
        (match) =>
          match.homeTeam.id === filterMatchId ||
          match.awayTeam.id === filterMatchId
      )
    : matchesDatas;

  //試合結果の順番をreverse
  const sortedMatches = isReversed
    ? filteredMatches.slice().reverse()
    : filteredMatches;

  const currentMatches =
    sortedMatches.length > 0 ? sortedMatches.slice(startIndex, endIndex) : [];
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
    const month = date.getMonth() + 1; // 月は0から始まるため+1します
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0"); // 分を2桁にフォーマットします

    return `${year}/${month}/${day} ${hours}:${minutes}`;
  };

  return (
    <>
      <Header></Header>
      {loadingLeague || loadingTeams || loadingScores || loadingMatches ? (
        <p className={c["nodata"]}>Loading...</p>
      ) : leagueData ? (
        <main className={s["leagueDetails"]}>
          <div className={s["title"]}>
            <div className={s["title__emblem"]}>
              <ImageWithFallback
                src={leagueData.emblem}
                alt={leagueData.name}
                width={80}
                height={80}
              />
            </div>
            <h2 className={s["title__text"]}>
              {leagueData.name} / {leagueData.area?.name ?? ""}
            </h2>
          </div>
          <p className={s["leagueDetails__season"]}>{`シーズン: ${
            leagueData.currentSeason?.startDate ?? "N/A"
          } ~ ${leagueData.currentSeason?.endDate ?? "N/A"}`}</p>
          {leagueData.currentSeason?.winner ? (
            <div className={s["leagueDetails__winner"]}>
              <GiChampions className={s["leagueDetails__winner__icon"]} />
              <div className={s["leagueDetails__winner__team"]}>
                <ImageWithFallback
                  src={leagueData.currentSeason.winner.crest}
                  alt={leagueData.name}
                  width={30}
                  height={30}
                />
                <p
                  className={s["leagueDetails__winner__text"]}
                >{`${leagueData.currentSeason.winner.name}`}</p>
              </div>
            </div>
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
                {scoresDatas.length > 0 ? (
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
                        <tr key={scoresData.player?.id ?? index}>
                          <td>{index + 1}</td>
                          <td>
                            <a
                              className={s["btn"]}
                              onClick={() =>
                                navigatePersons(scoresData.player?.id ?? 0)
                              }
                            >
                              {scoresData.player?.name ?? "N/A"}
                            </a>
                          </td>
                          <td
                            className={s["btn"]}
                            onClick={() =>
                              navigateTeams(scoresData.team?.id ?? 0)
                            }
                          >
                            <ImageWithFallback
                              src={scoresData.team?.crest ?? ""}
                              alt={scoresData.team?.name ?? "N/A"}
                              width={30}
                              height={30}
                            />
                            <p className={s["btn"]}>
                              {scoresData.team?.name ?? "N/A"}
                            </p>
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
                ) : (
                  <p className={c["nodata"]}>NO DATA</p>
                )}
              </div>
            ) : activeTab === "matches" ? (
              <div>
                <h3>試合結果</h3>
                {matchesDatas.length > 0 ? (
                  <>
                    <div className={c["func"]}>
                      <div className={c["func__filter"]}>
                        <label htmlFor="teamFilter">チームでフィルター</label>
                        <select
                          id="teamFilter"
                          className={c["func__filter__select"]}
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
                      <Button
                        onClick={() => setIsReversed(!isReversed)}
                        className={c["func__sortButton"]}
                      >
                        {isReversed ? "古い順にする" : "最新順にする"}
                      </Button>
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
                                    navigateTeams(matchesData.homeTeam?.id ?? 0)
                                  }
                                  className={c["matches__teamOuter"]}
                                >
                                  <ImageWithFallback
                                    src={matchesData.homeTeam?.crest ?? ""}
                                    alt={matchesData.homeTeam?.name ?? "N/A"}
                                    width={30}
                                    height={30}
                                  />
                                  <p>{matchesData.homeTeam?.name ?? "N/A"}</p>
                                </div>
                              </td>
                              <td>
                                {matchesData.score?.fullTime?.home}
                                {"-"}
                                {matchesData.score?.fullTime?.away}
                              </td>
                              <td>
                                <div
                                  onClick={() =>
                                    navigateTeams(matchesData.awayTeam?.id ?? 0)
                                  }
                                  className={c["matches__teamOuter"]}
                                >
                                  <ImageWithFallback
                                    src={matchesData.awayTeam?.crest ?? ""}
                                    alt={matchesData.awayTeam?.name ?? "N/A"}
                                    width={30}
                                    height={30}
                                  />
                                  <p>{matchesData.awayTeam?.name ?? "N/A"}</p>
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
                  </>
                ) : (
                  <p className={c["nodata"]}>NO DATA</p>
                )}
              </div>
            ) : (
              <div>
                <h3>チーム一覧</h3>
                {teamsData.length > 0 ? (
                  <div className={s["teamsGrid"]}>
                    {teamsData.map((teamData) => (
                      <a
                        key={teamData.id}
                        onClick={() => navigateTeams(teamData.id)}
                        className={s["teamItem"]}
                      >
                        <ImageWithFallback
                          src={teamData.crest}
                          alt={teamData.name}
                          width={50}
                          height={50}
                        />
                        <p>{teamData.name}</p>
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className={c["nodata"]}>NODATA</p>
                )}
              </div>
            )}
          </div>
        </main>
      ) : (
        <p className={c["nodata"]}>NODATA</p>
      )}
      <ScrollButton onClick={scrollToTop} />
    </>
  );
}
