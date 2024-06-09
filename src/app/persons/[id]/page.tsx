"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaHeart } from "react-icons/fa";
import s from "./page.module.scss";
import c from "../../../components/common.module.scss";
import ImageWithFallback from "../../../components/ImageWithFallback";
import Header from "../../../components/Header";
import Button from "../../../components/Button";
import ScrollButton from "../../../components/ScrollButton";

type PersonData = {
  name: string;
  currentTeam: {
    name: string;
    crest: string;
    id: number;
  };
  position: string;
  nationality: string;
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
    emblem: string;
    name: string;
    id: number;
    type: string;
  };
  season: {
    startDate: string;
    endDate: string;
  };
  stage: string;
};

type FavoritePerson = {
  id: number;
  name: string;
  crest: string;
};

export default function PersonsPage() {
  const [personsData, setPersonsData] = useState<PersonData | null>(null);
  const [personsMatchesData, setPersonsMatchesData] = useState<MatchData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [teamId, setTeamId] = useState<number | null>(null);
  const [personId, setPersonId] = useState<number | null>(null);
  const [leagueId, setLeagueId] = useState<number | null>(null);
  const [filterLeagueId, setFilterLeagueId] = useState<number | null>(null);
  const [loadingPersons, setLoadingPersons] = useState(true);
  const [loadingPersonMatches, setLoadingPersonMatches] = useState(true);

  const [isReversed, setIsReversed] = useState<boolean>(false);

  const itemsPerPage = 10;
  const { id } = useParams();

  const [favoritePersons, setFavoritePersons] = useState<FavoritePerson[]>(
    () => {
      if (typeof window !== "undefined") {
        const savedFavorites = localStorage.getItem("favoritePersons");
        return savedFavorites ? JSON.parse(savedFavorites) : [];
      }
      return [];
    }
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("favoritePersons", JSON.stringify(favoritePersons));
    }
  }, [favoritePersons]);

  const addFavoritePerson = (
    personId: number,
    personName: string,
    personCrest: string
  ) => {
    setFavoritePersons((prevFavorites) => {
      if (!prevFavorites.some((person) => person.id === personId)) {
        return [
          ...prevFavorites,
          { id: personId, name: personName, crest: personCrest },
        ];
      }
      return prevFavorites;
    });
  };

  const removeFavoritePerson = (personId: number) => {
    setFavoritePersons((prevFavorites) =>
      prevFavorites.filter((person) => person.id !== personId)
    );
  };

  const isFavoritePerson = (personId: number) => {
    return favoritePersons.some((person) => person.id === personId);
  };

  useEffect(() => {
    async function fetchPersonsData() {
      if (id) {
        try {
          const res = await fetch(`/api/persons/${id}`);
          if (!res.ok) throw new Error("Failed to fetch person data");
          const jsonData = await res.json();
          setPersonsData(jsonData);
          setLoadingPersons(false);
        } catch (error) {
          console.error("Error fetching person data:", error);
          setPersonsData(null);
          setLoadingPersons(false);
        }
      }
    }
    fetchPersonsData();
  }, [id]);

  useEffect(() => {
    async function fetchPersonsMatchesData() {
      if (id) {
        try {
          const res = await fetch(`/api/persons/${id}/matches`);
          if (!res.ok) throw new Error("Failed to fetch person matches data");
          const jsonData = await res.json();
          setPersonsMatchesData(jsonData.matches);
          setLoadingPersonMatches(false);
        } catch (error) {
          console.error("Error fetching person matches data:", error);
          setPersonsMatchesData([]);
          setLoadingPersonMatches(false);
        }
      }
    }
    fetchPersonsMatchesData();
  }, [id]);

  console.log("personsData", personsData);
  console.log("personsMatchesData", personsMatchesData);

  const router = useRouter();
  const navigateTeams = (id: number) => {
    setTeamId(id);
    router.push(`/teams/${id}`);
  };
  const navigateLeague = (id: number) => {
    setTeamId(id);
    router.push(`/league/${id}`);
  };

  const handleFilterLeagueChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = e.target.value;
    setFilterLeagueId(value === "" ? null : parseInt(value));
    setCurrentPage(1); // Reset to first page on filter change
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const filteredMatches = filterLeagueId
    ? personsMatchesData.filter(
        (match) => match.competition.id === filterLeagueId
      )
    : personsMatchesData;
  //試合結果の順番をreverse
  const sortedMatches = isReversed
    ? filteredMatches.slice().reverse()
    : filteredMatches;
  const currentMatches = sortedMatches.slice(startIndex, endIndex);
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

  return (
    <>
      <Header />
      {loadingPersons || loadingPersonMatches ? (
        <p className={`${c["nodata"]} ${c["nodata-center"]}`}>Loading...</p>
      ) : personsData ? (
        <>
          <main className={c["container"]}>
            <h2 className={c["container__title"]}>PLAYER</h2>
            <div className={c["heading"]}>
              <div className={c["title"]}>
                <div className={c["title__emblem"]}>
                  <ImageWithFallback
                    src={personsData.currentTeam?.crest ?? ""}
                    alt={personsData.name}
                    width={50}
                    height={50}
                  />
                </div>
                <h2 className={c["title__text"]}>{personsData.name}</h2>
                {personsData.name && personsData.currentTeam.crest && (
                  <a
                    onClick={() =>
                      isFavoritePerson(Number(id))
                        ? removeFavoritePerson(Number(id))
                        : addFavoritePerson(
                            Number(id),
                            personsData.name,
                            personsData.currentTeam?.crest ?? ""
                          )
                    }
                    className={`${c["favoriteButton"]} ${
                      isFavoritePerson(Number(id))
                        ? c["favorite"]
                        : c["notFavorite"]
                    }`}
                  >
                    <FaHeart />
                  </a>
                )}
              </div>
            </div>
            <p className={c["container__position"]}>{personsData.position}</p>
            <div className={c["container__team"]}>
              <a
                className={c["container__team__currentTeam"]}
                onClick={() =>
                  personsData.currentTeam?.id
                    ? navigateTeams(personsData.currentTeam.id)
                    : undefined
                }
              >
                {personsData.currentTeam?.name ?? "N/A"}
              </a>
            </div>
            <div className={c["matches"]}>
              <h3 className={c["matches__title"]}>試合結果</h3>
              {personsMatchesData.length > 0 ? (
                <>
                  <div className={c["func"]}>
                    <div className={c["func__filter"]}>
                      <label htmlFor="leagueFilter">
                        大会・リーグでフィルター
                      </label>
                      <select
                        id="leagueFilter"
                        onChange={handleFilterLeagueChange}
                        className={c["func__filter__select"]}
                      >
                        <option value="">全ての大会・リーグ</option>
                        {Array.from(
                          new Set(
                            personsMatchesData.map(
                              (match) => match.competition.id
                            )
                          )
                        ).map((id) => {
                          const league = personsMatchesData.find(
                            (match) => match.competition.id === id
                          )?.competition;
                          return (
                            <option key={id} value={id}>
                              {league?.name ?? "N/A"}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                    <Button
                      onClick={() => setIsReversed(!isReversed)}
                      className={c["func__sortButton"]}
                    >
                      {isReversed ? "最新順にする" : "古い順にする"}
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
                          <th className={c["nowrap"]}>グループ</th>
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
                                {matchesData.score?.fullTime?.home ?? "N/A"}
                                {"-"}
                                {matchesData.score?.fullTime?.away ?? "N/A"}
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
                                    src={matchesData.competition?.emblem ?? ""}
                                    alt={matchesData.competition?.name ?? "N/A"}
                                    width={30}
                                    height={30}
                                  />
                                  <p>
                                    {matchesData.competition?.name ?? "N/A"}
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
                              <td>
                                {matchesData.group ? matchesData.group : "-"}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  {/* スマホ用のカードレイアウト */}
                  <div className={c["matches__cards"]}>
                    {currentMatches.map((matchesData) => (
                      <div key={matchesData.id} className={c["matches__card"]}>
                        <div className={c["matches__card__row"]}>
                          <span className={c["matches__card__value"]}>
                            {formatDate(matchesData.utcDate)}
                          </span>
                        </div>
                        <div className={c["matches__card__row"]}>
                          <div className={c["matches__teamScore"]}>
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
                            <span className={c["matches__score"]}>
                              {matchesData.score?.fullTime?.home ?? "N/A"}
                            </span>
                          </div>
                        </div>
                        <div className={c["matches__card__row"]}>
                          <div className={c["matches__teamScore"]}>
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
                            <span className={c["matches__score"]}>
                              {matchesData.score?.fullTime?.away ?? "N/A"}
                            </span>
                          </div>
                        </div>
                        <div className={c["matches__card__row"]}>
                          <a
                            onClick={() =>
                              navigateLeague(matchesData.competition?.id ?? 0)
                            }
                            className={c["matches__competition"]}
                          >
                            <ImageWithFallback
                              src={matchesData.competition?.emblem ?? ""}
                              alt={matchesData.competition?.name ?? "N/A"}
                              width={30}
                              height={30}
                            />
                            <p>{matchesData.competition?.name ?? "N/A"}</p>
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
                                  ? matchesData.group.replace("GROUP_", "")
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
          </main>
        </>
      ) : (
        <p className={`${c["nodata"]} ${c["nodata-center"]}`}>NO DATA</p>
      )}
      <ScrollButton onClick={scrollToTop} />
    </>
  );
}
