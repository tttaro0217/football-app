"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaHeart } from "react-icons/fa";
import ImageWithFallback from "../../../components/ImageWithFallback";
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
    type: string;
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

type FavoriteTeam = {
  id: number;
  name: string;
  crest: string;
};

export default function TeamsPage() {
  const [teamsData, setTeamsData] = useState<TeamData | null>(null);
  const [teamsMatchesData, setTeamsMatchesData] = useState<MatchData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState<"players" | "matches">("players");
  const [teamId, setTeamId] = useState<number | null>(null);
  const [personId, setPersonId] = useState<number | null>(null);
  const [leagueId, setLeagueId] = useState<number | null>(null);
  const [filterPosition, setFilterPosition] = useState<string>("");
  const [filterCompetitionId, setFilterCompetitionId] = useState<number | null>(
    null
  ); // 大会・リーグのフィルタ用状態を追加
  const [loadingTeams, setLoadingTeams] = useState(true);
  const [loadingTeamMatches, setLoadingTeamMatches] = useState(true);

  const [isReversed, setIsReversed] = useState<boolean>(false);

  const itemsPerPage = 10;
  const { id } = useParams(); // useParamsを使ってパスパラメータを取得

  // New state for favorites
  const [favoriteTeams, setFavoriteTeams] = useState<FavoriteTeam[]>(() => {
    if (typeof window !== "undefined") {
      const savedFavorites = localStorage.getItem("favoriteTeams");
      return savedFavorites ? JSON.parse(savedFavorites) : [];
    }
    return [];
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("favoriteTeams", JSON.stringify(favoriteTeams));
    }
  }, [favoriteTeams]);

  const addFavoriteTeam = (
    teamId: number,
    teamName: string,
    teamCrest: string
  ) => {
    setFavoriteTeams((prevFavorites) => {
      if (!prevFavorites.some((team) => team.id === teamId)) {
        return [
          ...prevFavorites,
          { id: teamId, name: teamName, crest: teamCrest },
        ];
      }
      return prevFavorites;
    });
  };

  const removeFavoriteTeam = (teamId: number) => {
    setFavoriteTeams((prevFavorites) =>
      prevFavorites.filter((team) => team.id !== teamId)
    );
  };

  const isFavoriteTeam = (teamId: number) => {
    return favoriteTeams.some((team) => team.id === teamId);
  };

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
        } finally {
          setLoadingTeams(false);
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
            setTeamsMatchesData(jsonData.matches);
          } else {
            setTeamsMatchesData([]);
          }
        } catch (error) {
          console.error("Error fetching matches data:", error);
          setTeamsMatchesData([]);
        } finally {
          setLoadingTeamMatches(false);
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

  //試合結果の順番をreverse
  const sortedMatches = isReversed
    ? filteredMatches.slice().reverse()
    : filteredMatches;

  const currentMatches =
    sortedMatches.length > 0 ? sortedMatches.slice(startIndex, endIndex) : [];
  const totalPages = Math.ceil(filteredMatches.length / itemsPerPage);

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
    setCurrentPage(1);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const formatDate = (isoDateString: string) => {
    const date = new Date(isoDateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // 月は0から始まるため+1
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
      <Header />
      {loadingTeams || loadingTeamMatches ? (
        <p className={`${c["nodata"]} ${c["nodata-center"]}`}>Loading...</p>
      ) : teamsData !== null ? (
        <>
          <main className={c["container"]}>
            <h2 className={c["container__title"]}>TEAM</h2>
            <div className={c["heading"]}>
              <div className={c["title"]}>
                <div className={c["title__top"]}>
                  <div className={c["title__emblem"]}>
                    <ImageWithFallback
                      src={teamsData.crest}
                      alt={teamsData.name}
                      width={50}
                      height={50}
                      className={c["title__emblem__icon"]}
                    />
                  </div>
                  <h2 className={c["title__text"]}>{teamsData.name}</h2>
                </div>
                {teamsData.name && teamsData.crest && (
                  <a
                    onClick={() =>
                      isFavoriteTeam(Number(id))
                        ? removeFavoriteTeam(Number(id))
                        : addFavoriteTeam(
                            Number(id),
                            teamsData.name,
                            teamsData.crest
                          )
                    }
                    className={`${c["favoriteButton"]} ${
                      isFavoriteTeam(Number(id))
                        ? c["favorite"]
                        : c["notFavorite"]
                    }`}
                  >
                    <FaHeart />
                  </a>
                )}
              </div>
            </div>
            <div className={c["tabs"]}>
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
            <div className={c["container__content"]}>
              {activeTab === "players" ? (
                <div className={s["players"]}>
                  <h3>所属選手</h3>
                  {teamsData.squad ? (
                    <>
                      <div className={c["func"]}>
                        <div className={c["func__filter"]}>
                          <label htmlFor="positionFilter">
                            ポジションでフィルター
                          </label>
                          <select
                            id="positionFilter"
                            onChange={handleFilterChange}
                            className={c["func__filter__select"]}
                          >
                            <option value="">ALL</option>
                            <option value="Goalkeeper">Goalkeeper</option>
                            <option value="Defence,Defender">
                              Defence, Defender
                            </option>
                            <option value="Midfield,Midfielder">
                              Midfield, Midfielder
                            </option>
                            <option value="Offence,Forward">
                              Offence, Forward
                            </option>
                          </select>
                        </div>
                      </div>
                      <table className={s["players__table"]}>
                        <thead>
                          <tr>
                            <th className={c["nowrap"]}>ポジション</th>
                            <th className={c["nowrap"]}>名前</th>
                            <th className={c["nowrap"]}>国</th>
                            <th className={c["nowrap"]}>誕生日</th>
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
                    </>
                  ) : (
                    <p className={c["matches__nodata"]}>NO DATA</p>
                  )}
                </div>
              ) : activeTab === "matches" ? (
                <div className={c["matches"]}>
                  <h3 className={c["matches__title"]}>試合結果</h3>
                  {teamsMatchesData.length > 0 ? (
                    <>
                      <div className={c["func"]}>
                        <div className={c["func__filter"]}>
                          <label htmlFor="competitionFilter">
                            大会・リーグでフィルター
                          </label>
                          <select
                            id="competitionFilter"
                            className={c["func__filter__select"]}
                            onChange={handleFilterCompetitionChange}
                          >
                            <option value="">ALL</option>
                            {Array.from(
                              new Set(
                                teamsMatchesData.map(
                                  (match) => match.competition.id
                                )
                              )
                            ).map((competitionId) => {
                              const competition = teamsMatchesData.find(
                                (match) =>
                                  match.competition.id === competitionId
                              )?.competition;
                              return (
                                <option
                                  key={competitionId}
                                  value={competitionId}
                                >
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
                                    (match) =>
                                      match.competition.id === competitionId
                                  )?.competition;
                                  return (
                                    <option
                                      key={competitionId}
                                      value={competitionId}
                                    >
                                      {competition?.name}
                                    </option>
                                  );
                                })
                              : null}
                          </select>
                        </div>
                        <Button
                          onClick={() => setIsReversed(!isReversed)}
                          className={c["func__sortButton"]}
                        >
                          {isReversed ? "古い順にする" : "最新順にする"}
                        </Button>
                      </div>
                      <div className={c["matches__table-wrapper"]}>
                        <table className={c["matches__table"]}>
                          <thead>
                            <tr>
                              <th className={c["nowrap"]}>日時</th>
                              <th className={c["nowrap"]}>ホーム</th>
                              <th className={c["nowrap"]}>スコア</th>
                              <th className={c["nowrap"]}>アウェイ</th>
                              <th className={c["nowrap"]}>大会・リーグ</th>
                              <th className={c["nowrap"]}>ステージ</th>
                            </tr>
                          </thead>
                          <tbody>
                            {currentMatches.map((matchesData) => (
                              <tr key={matchesData.id}>
                                <td>{formatDate(matchesData.utcDate)}</td>
                                <td>
                                  <a
                                    onClick={() =>
                                      navigateTeam(
                                        matchesData.homeTeam?.id ?? 0
                                      )
                                    }
                                    className={c["matches__teamOuter"]}
                                  >
                                    <ImageWithFallback
                                      src={matchesData.homeTeam?.crest ?? ""}
                                      alt={
                                        matchesData.homeTeam?.name ?? "NO DATA"
                                      }
                                      width={30}
                                      height={30}
                                    />
                                    <p>
                                      {matchesData.homeTeam?.name ?? "NO DATA"}
                                    </p>
                                  </a>
                                </td>
                                <td>
                                  {matchesData.score?.fullTime?.home ?? "-"}
                                  {"-"}
                                  {matchesData.score?.fullTime?.away ?? "-"}
                                </td>
                                <td>
                                  <a
                                    onClick={() =>
                                      navigateTeam(
                                        matchesData.awayTeam?.id ?? 0
                                      )
                                    }
                                    className={c["matches__teamOuter"]}
                                  >
                                    <ImageWithFallback
                                      src={matchesData.awayTeam?.crest ?? ""}
                                      alt={
                                        matchesData.awayTeam?.name ?? "NO DATA"
                                      }
                                      width={30}
                                      height={30}
                                    />
                                    <p>
                                      {matchesData.awayTeam?.name ?? "NO DATA"}
                                    </p>
                                  </a>
                                </td>
                                <td>
                                  <a
                                    onClick={() =>
                                      navigateLeague(
                                        matchesData.competition?.id ?? 0
                                      )
                                    }
                                    className={c["matches__competition"]}
                                  >
                                    <ImageWithFallback
                                      src={
                                        matchesData.competition?.emblem ?? ""
                                      }
                                      alt={
                                        matchesData.competition?.name ??
                                        "NO DATA"
                                      }
                                      width={30}
                                      height={30}
                                    />
                                    <p>
                                      {matchesData.competition?.name ??
                                        "NO DATA"}
                                    </p>
                                    <p className={c["matches__seazon"]}>
                                      {formatSeason(
                                        matchesData.season?.startDate ?? "",
                                        matchesData.season?.endDate ?? ""
                                      )}
                                    </p>
                                  </a>
                                </td>
                                <td>{matchesData.stage}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      {/* スマホ用のカードレイアウト */}
                      <div className={c["matches__cards"]}>
                        {currentMatches.map((matchesData) => (
                          <div
                            key={matchesData.id}
                            className={c["matches__card"]}
                          >
                            <div className={c["matches__card__row"]}>
                              <span className={c["matches__card__value"]}>
                                {formatDate(matchesData.utcDate)}
                              </span>
                            </div>
                            <div className={c["matches__card__row"]}>
                              <div className={c["matches__teamScore"]}>
                                <div
                                  onClick={() =>
                                    navigateTeam(matchesData.homeTeam?.id ?? 0)
                                  }
                                  className={c["matches__teamOuter"]}
                                >
                                  <ImageWithFallback
                                    src={matchesData.homeTeam?.crest ?? ""}
                                    alt={
                                      matchesData.homeTeam?.name ?? "NO DATA"
                                    }
                                    width={30}
                                    height={30}
                                  />
                                  <p>
                                    {matchesData.homeTeam?.name ?? "NO DATA"}
                                  </p>
                                </div>
                                <span className={c["matches__score"]}>
                                  {matchesData.score?.fullTime?.home ?? "-"}
                                </span>
                              </div>
                            </div>
                            <div className={c["matches__card__row"]}>
                              <div className={c["matches__teamScore"]}>
                                <div
                                  onClick={() =>
                                    navigateTeam(matchesData.awayTeam?.id ?? 0)
                                  }
                                  className={c["matches__teamOuter"]}
                                >
                                  <ImageWithFallback
                                    src={matchesData.awayTeam?.crest ?? ""}
                                    alt={
                                      matchesData.awayTeam?.name ?? "NO DATA"
                                    }
                                    width={30}
                                    height={30}
                                  />
                                  <p>
                                    {matchesData.awayTeam?.name ?? "NO DATA"}
                                  </p>
                                </div>
                                <span className={c["matches__score"]}>
                                  {matchesData.score?.fullTime?.away ?? "-"}
                                </span>
                              </div>
                            </div>
                            <div className={c["matches__card__row"]}>
                              <a
                                onClick={() =>
                                  navigateLeague(
                                    matchesData.competition?.id ?? 0
                                  )
                                }
                                className={c["matches__competition"]}
                              >
                                <ImageWithFallback
                                  src={matchesData.competition?.emblem ?? ""}
                                  alt={
                                    matchesData.competition?.name ?? "NO DATA"
                                  }
                                  width={30}
                                  height={30}
                                />
                                <p>
                                  {matchesData.competition?.name ?? "NO DATA"}
                                </p>
                                <p className={c["matches__seazon"]}>
                                  {formatSeason(
                                    matchesData.season?.startDate ?? "",
                                    matchesData.season?.endDate ?? ""
                                  )}
                                </p>
                              </a>
                            </div>
                            {matchesData.competition.type === "CUP" && (
                              <>
                                <div className={c["matches__card__row"]}>
                                  <span className={c["matches__card__value"]}>
                                    {matchesData.stage}
                                  </span>
                                </div>
                                <div className={c["matches__card__row"]}>
                                  <span className={c["matches__card__value"]}>
                                    {matchesData.group
                                      ? matchesData.group
                                      : "-"}
                                  </span>
                                </div>
                              </>
                            )}
                          </div>
                        ))}
                      </div>
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
                    <p className={c["matches__nodata"]}>NO DATA</p>
                  )}
                </div>
              ) : null}
            </div>
          </main>
        </>
      ) : (
        <p className={`${c["nodata"]} ${c["nodata-center"]}`}>NO DATA</p>
      )}
      <ScrollButton onClick={scrollToTop} />
    </>
  );
}
