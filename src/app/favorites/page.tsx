"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../../components/Header";
import Button from "../../components/Button";
import ImageWithFallback from "../../components/ImageWithFallback";
import s from "./page.module.scss";
import c from "../../components/common.module.scss";

type FavoriteDatas = {
  id: number;
  name: string;
  crest: string;
};

export default function FavoritesPage() {
  const [favoriteTeams, setFavoriteTeams] = useState<FavoriteDatas[]>([]);
  const [favoritePersons, setFavoritePersons] = useState<FavoriteDatas[]>([]);
  const [loadingTeams, setLoadingTeams] = useState(true);
  const [loadingPersons, setLoadingPersons] = useState(true);

  const router = useRouter();
  const navigateTeam = (id: number | null) => {
    router.push(`/teams/${id}`);
  };
  const navigatePerson = (id: number | null) => {
    router.push(`/persons/${id}`);
  };

  /**
   * 初期読み込み時、ローカルストレージのデータを取得
   */
  useEffect(() => {
    const localStorageTeamsData = localStorage.getItem("favoriteTeams");
    const parsedTeamsData = localStorageTeamsData
      ? JSON.parse(localStorageTeamsData)
      : [];
    console.log(parsedTeamsData);
    setFavoriteTeams(parsedTeamsData);
    setLoadingTeams(false); // データ取得完了後にローディング状態を更新
  }, []);

  useEffect(() => {
    const localStoragePersonsData = localStorage.getItem("favoritePersons");
    const parsedPersonsData = localStoragePersonsData
      ? JSON.parse(localStoragePersonsData)
      : [];
    console.log(parsedPersonsData);
    setFavoritePersons(parsedPersonsData);
    setLoadingPersons(false); // データ取得完了後にローディング状態を更新
  }, []);

  const removeFavorite = (id: number, type: "team" | "person") => {
    if (type === "team") {
      const updatedTeams = favoriteTeams.filter((team) => team.id !== id);
      setFavoriteTeams(updatedTeams);
      localStorage.setItem("favoriteTeams", JSON.stringify(updatedTeams));
    } else {
      const updatedPersons = favoritePersons.filter(
        (person) => person.id !== id
      );
      setFavoritePersons(updatedPersons);
      localStorage.setItem("favoritePersons", JSON.stringify(updatedPersons));
    }
  };

  return (
    <>
      <Header />
      <main className={s["favorite"]}>
        <h2 className={s["favorite__title"]}>FAVORITE LIST</h2>
        <div>
          <div>
            <h3 className={s["favorite__heading"]}>TEAM</h3>
            {loadingTeams ? (
              <p className={c["nodata"]}>Loading...</p>
            ) : favoriteTeams.length > 0 ? (
              <ul className={s["favorite__lists"]}>
                {favoriteTeams.map((favoriteTeam) => (
                  <li key={favoriteTeam.id} className={s["favorite__list"]}>
                    <a
                      className={s["favorite__link"]}
                      onClick={() => navigateTeam(favoriteTeam.id)}
                    >
                      <ImageWithFallback
                        src={favoriteTeam.crest}
                        alt={favoriteTeam.name}
                        width={50}
                        height={50}
                      />
                      <p>{favoriteTeam.name}</p>
                    </a>
                    <Button
                      onClick={() => removeFavorite(favoriteTeam.id, "team")}
                      className={s["favorite__remove"]}
                    >
                      削除
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className={c["nodata"]}>
                お気に入り登録しているチームはありません。
              </p>
            )}
          </div>
          <div>
            <h3 className={s["favorite__heading"]}>PLAYER</h3>
            {loadingPersons ? (
              <p className={c["nodata"]}>Loading...</p>
            ) : favoritePersons.length > 0 ? (
              <ul className={s["favorite__lists"]}>
                {favoritePersons.map((favoritePerson) => (
                  <li key={favoritePerson.id} className={s["favorite__list"]}>
                    <a
                      className={s["favorite__link"]}
                      onClick={() => navigatePerson(favoritePerson.id)}
                    >
                      <ImageWithFallback
                        src={favoritePerson.crest}
                        alt={favoritePerson.name}
                        width={50}
                        height={50}
                      />
                      <p>{favoritePerson.name}</p>
                    </a>
                    <Button
                      onClick={() =>
                        removeFavorite(favoritePerson.id, "person")
                      }
                      className={s["favorite__remove"]}
                    >
                      削除
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className={c["nodata"]}>
                お気に入り登録している選手はいません。
              </p>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
