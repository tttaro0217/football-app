"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import s from "./page.module.scss";
import c from "../../../components/common.module.scss";
import Header from "../../../components/Header";
import Button from "../../../components/Button";
import ScrollButton from "../../../components/ScrollButton";

type TeamData = {
  name: string;
  crest: string;
  website: string;
  squad: {
    name: string;
    id: number;
    position: string;
    nationality: string;
    dateOfBirth: string;
  }[];
  coach: {
    name: string;
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
  competition: {
    emblem: string;
    name: string;
    id: number;
  };
  score: {
    winner: string;
    fullTime: {
      home: number;
      away: number;
    };
  };
  utcDate: string;
  group: string;
  season: {
    startDate: string;
    endDate: string;
  };
  stage: string;
};

export default function TeamsPage() {
  const [teamsData, setTeamsData] = useState<TeamData | null>(null);
  const [teamsMatchesData, setTeamsMatchesData] = useState<MatchData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState<"players" | "matches">("players");
  const [teamId, setTeamId] = useState<number | null>(null);
  const [personId, setPersonId] = useState<number | null>(null);
  const [leagueId, setLeagueId] = useState<number | null>(null);
  const [filterPosition, setFilterPosition] = useState<string>(""); // 空文字列を初期値に設定
  const [filterCompetitionId, setFilterCompetitionId] = useState<number | null>(
    null
  ); // 大会・リーグのフィルタ用状態を追加

  const itemsPerPage = 10;
  const { id } = useParams(); // useParamsを使ってパスパラメータを取得

  //フィルターをリセット
  useEffect(() => {
    if (activeTab === "players") {
      setFilterPosition("");
    } else if (activeTab === "matches") {
      setFilterCompetitionId(null);
    }
  }, [activeTab]);

  useEffect(() => {
    async function fetchTeamsData() {
      if (id) {
        try {
          const res = await fetch(`/api/teams/${id}`);
          const jsonData = await res.json();
          setTeamsData(jsonData);
        } catch (error) {
          console.error("Error fetching team data:", error);
        }
      }
    }
    fetchTeamsData();
  }, [id]);

  useEffect(() => {
    async function fetchTeamsMatchesData() {
      if (id) {
        try {
          const res = await fetch(`/api/teams/${id}/matches`);
          const jsonData = await res.json();
          if (jsonData && Array.isArray(jsonData.matches)) {
            setTeamsMatchesData(jsonData.matches.reverse());
          } else {
            setTeamsMatchesData([]);
          }
        } catch (error) {
          console.error("Error fetching matches data:", error);
          setTeamsMatchesData([]);
        }
      }
    }
    fetchTeamsMatchesData();
  }, [id]);

  const router = useRouter();
  const navigatePerson = (id: number) => {
    setPersonId(id);
    router.push(`/persons/${id}`);
  };
  const navigateLeague = (id: number) => {
    setLeagueId(id);
    router.push(`/league/${id}`);
  };
  const navigateTeam = (id: number) => {
    setTeamId(id);
    router.push(`/teams/${id}`);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const filteredMatches = filterCompetitionId
    ? teamsMatchesData.filter(
        (match) => match.competition.id === filterCompetitionId
      )
    : teamsMatchesData;

  const currentMatches =
    filteredMatches.length > 0
      ? filteredMatches.slice(startIndex, endIndex)
      : [];
  const totalPages = Math.ceil(filteredMatches.length / itemsPerPage);

  const filteredPlayers = teamsData?.squad.filter(
    (player) =>
      filterPosition === "" || player.position.includes(filterPosition)
  );

  const handleNextPage = () => {
    if (endIndex < filteredMatches.length) {
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

  const handleTabClick = (tab: "players" | "matches") => {
    setActiveTab(tab);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterPosition(e.target.value);
  };

  const handleFilterCompetitionChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = e.target.value;
    setFilterCompetitionId(value === "" ? null : parseInt(value));
    setCurrentPage(1); // Reset to the first page when filter changes
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
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

  const formatSeason = (startDateString: string, endDateString: string) => {
    const startYear = new Date(startDateString)
      .getFullYear()
      .toString()
      .slice(-2);
    const endYear = new Date(endDateString).getFullYear().toString().slice(-2);
    return `${startYear}/${endYear}`;
  };

  console.log("teamsMatchesData", teamsMatchesData);
  console.log("teamsData", teamsData);

  return (
    <>
      {teamsData && teamsMatchesData.length > 0 ? (
        <>
          <Header></Header>
          <main className={s["teamDetails"]}>
            <div className={s["title"]}>
              <div className={s["title__emblem"]}>
                <Image src={teamsData.crest} alt="" width={50} height={50} />
              </div>
              <h2 className={s["title__text"]}>{teamsData.name}</h2>
            </div>
            <div className={s["tabs"]}>
              <Button
                onClick={() => handleTabClick("players")}
                className={activeTab === "players" ? c["active"] : ""}
              >
                所属選手
              </Button>
              <Button
                onClick={() => handleTabClick("matches")}
                className={activeTab === "matches" ? c["active"] : ""}
              >
                試合結果
              </Button>
            </div>
            <div className={s["leagueDetails__content"]}>
              {activeTab === "players" ? (
                <div className={s["players"]}>
                  <h3>所属選手</h3>
                  <label htmlFor="positionFilter">ポジションでフィルター</label>
                  <select
                    id="positionFilter"
                    onChange={handleFilterChange}
                    className={c["filter"]}
                  >
                    <option value="">ALL</option>
                    <option value="Goalkeeper">Goalkeeper</option>
                    <option value="Defence,Defender">Defence, Defender</option>
                    <option value="Midfield,Midfielder">
                      Midfield, Midfielder
                    </option>
                    <option value="Offence,Forward">Offence, Forward</option>
                  </select>
                  <table className={s["players__table"]}>
                    <thead>
                      <tr>
                        <th>ポジション</th>
                        <th>名前</th>
                        <th>国</th>
                        <th>誕生日</th>
                      </tr>
                    </thead>
                    <tbody>
                      {teamsData.squad
                        .filter((player) => {
                          if (filterPosition === "") return true;
                          const filterPositions = filterPosition.split(",");
                          return filterPositions.includes(player.position);
                        })
                        .map((player) => (
                          <tr key={player.id}>
                            <td>{player.position}</td>
                            <td>
                              <a
                                onClick={() => navigatePerson(player.id)}
                                className={s["players__link"]}
                              >
                                {player.name}
                              </a>
                            </td>
                            <td>{player.nationality}</td>
                            <td>{player.dateOfBirth}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              ) : activeTab === "matches" ? (
                <div className={c["matches"]}>
                  <h3 className={c["matches__title"]}>試合結果</h3>
                  <div>
                    <label htmlFor="competitionFilter">
                      大会・リーグでフィルター
                    </label>
                    <select
                      id="competitionFilter"
                      className={c["filter"]}
                      onChange={handleFilterCompetitionChange}
                    >
                      <option value="">ALL</option>
                      {Array.from(
                        new Set(
                          teamsMatchesData.map((match) => match.competition.id)
                        )
                      ).map((competitionId) => {
                        const competition = teamsMatchesData.find(
                          (match) => match.competition.id === competitionId
                        )?.competition;
                        return (
                          <option key={competitionId} value={competitionId}>
                            {competition?.name}
                          </option>
                        );
                      }).length > 1
                        ? Array.from(
                            new Set(
                              teamsMatchesData.map(
                                (match) => match.competition.id
                              )
                            )
                          ).map((competitionId) => {
                            const competition = teamsMatchesData.find(
                              (match) => match.competition.id === competitionId
                            )?.competition;
                            return (
                              <option key={competitionId} value={competitionId}>
                                {competition?.name}
                              </option>
                            );
                          })
                        : null}
                    </select>
                  </div>

                  <table className={c["matches__table"]}>
                    <thead>
                      <tr>
                        <th>日時</th>
                        <th>ホームチーム</th>
                        <th>スコア</th>
                        <th>アウェイチーム</th>
                        <th>大会・リーグ</th>
                        <th>ステージ</th>
                        <th>グループ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentMatches.map((matchesData) => {
                        return (
                          <tr key={matchesData.id}>
                            <td>{formatDate(matchesData.utcDate)}</td>
                            <td>
                              <a
                                onClick={() =>
                                  navigateTeam(matchesData.homeTeam.id)
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
                              </a>
                            </td>
                            <td>
                              {matchesData.score.fullTime.home}
                              {"-"}
                              {matchesData.score.fullTime.away}
                            </td>
                            <td>
                              <a
                                onClick={() =>
                                  navigateTeam(matchesData.awayTeam.id)
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
                              </a>
                            </td>
                            <td>
                              <a
                                onClick={() =>
                                  navigateLeague(matchesData.competition.id)
                                }
                                className={s["matches__competition"]}
                              >
                                <Image
                                  src={matchesData.competition.emblem}
                                  alt=""
                                  width={30}
                                  height={30}
                                />
                                <p>{matchesData.competition.name}</p>
                                <p className={c["matches__seazon"]}>
                                  {formatSeason(
                                    matchesData.season.startDate,
                                    matchesData.season.endDate
                                  )}
                                </p>
                              </a>
                            </td>
                            <td>{matchesData.stage}</td>
                            <td>{matchesData.group ?? "-"}</td>
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
              ) : null}
            </div>
            <div>
              <h3>詳細</h3>
              <p>{`スタジアム：${teamsData.venue}`}</p>
              <a
                href={teamsData.website}
                target="_blank"
                rel="noopener noreferrer"
              >
                website
              </a>
              {teamsData.coach && <p>{`監督：${teamsData.coach.name}`}</p>}
              <p>
                監督の契約期間：
                {`${teamsData.coach.contract.start}~${teamsData.coach.contract.until}`}
              </p>
              <p>クラブカラー：{teamsData.clubColors}</p>
              {/* <a>所属リーグ、大会：{teamsData.runningCompetitions}</a> */}
              <p>{}</p>
            </div>
            <ScrollButton onClick={scrollToTop} />
          </main>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
}
