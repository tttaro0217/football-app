"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaHeart } from "react-icons/fa";
import Header from "../../components/Header";
import Button from "../../components/Button";
import ImageWithFallback from "../../components/ImageWithFallback";
import s from "./page.module.scss";
import c from "../../components/common.module.scss";
import ScrollButton from "../../components/ScrollButton";

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
  const navigateTeam = (id: number) => {
    router.push(`/teams/${id}`);
  };
  const navigatePerson = (id: number) => {
    router.push(`/persons/${id}`);
  };
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const localStorageTeamsData = localStorage.getItem("favoriteTeams");
    const parsedTeamsData = localStorageTeamsData
      ? JSON.parse(localStorageTeamsData)
      : [];
    console.log(parsedTeamsData);
    setFavoriteTeams(parsedTeamsData);
    setLoadingTeams(false);
  }, []);

  useEffect(() => {
    const localStoragePersonsData = localStorage.getItem("favoritePersons");
    const parsedPersonsData = localStoragePersonsData
      ? JSON.parse(localStoragePersonsData)
      : [];
    console.log(parsedPersonsData);
    setFavoritePersons(parsedPersonsData);
    setLoadingPersons(false);
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
        <div className={s["favorite__title"]}>
          <FaHeart className={s["favorite__title__button"]} />
          <h2 className={s["favorite__title__text"]}>FAVORITE LIST</h2>
        </div>
        <div>
          <div className={s["favorite__content"]}>
            <h3 className={s["favorite__heading"]}>TEAM</h3>
            {loadingTeams ? (
              <p className={c["nodata"]}>Loading...</p>
            ) : favoriteTeams.length > 0 ? (
              <ul className={s["favorite__lists"]}>
                {favoriteTeams.map((favoriteTeam) => (
                  <li key={favoriteTeam.id} className={s["favorite__list"]}>
                    <div className={s["favorite__item"]}>
                      <ImageWithFallback
                        src={favoriteTeam.crest}
                        alt={favoriteTeam.name}
                        width={50}
                        height={50}
                      />
                      <p className={s["favorite__text"]}>{favoriteTeam.name}</p>
                    </div>
                    <div className={s["favorite__buttons"]}>
                      <Button
                        onClick={() => navigateTeam(favoriteTeam.id)}
                        className={s["favorite__link"]}
                      >
                        詳細
                      </Button>
                      <Button
                        onClick={() => removeFavorite(favoriteTeam.id, "team")}
                        className={s["favorite__remove"]}
                      >
                        削除
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className={c["nodata"]}>
                お気に入り登録しているチームはありません。
              </p>
            )}
          </div>
          <div className={s["favorite__content"]}>
            <h3 className={s["favorite__heading"]}>PLAYER</h3>
            {loadingPersons ? (
              <p className={c["nodata"]}>Loading...</p>
            ) : favoritePersons.length > 0 ? (
              <ul className={s["favorite__lists"]}>
                {favoritePersons.map((favoritePerson) => (
                  <li key={favoritePerson.id} className={s["favorite__list"]}>
                    <div className={s["favorite__item"]}>
                      <ImageWithFallback
                        src={favoritePerson.crest}
                        alt={favoritePerson.name}
                        width={50}
                        height={50}
                      />
                      <p className={s["favorite__text"]}>
                        {favoritePerson.name}
                      </p>
                    </div>
                    <div className={s["favorite__buttons"]}>
                      <Button
                        onClick={() => navigatePerson(favoritePerson.id)}
                        className={s["favorite__link"]}
                      >
                        詳細
                      </Button>
                      <Button
                        onClick={() =>
                          removeFavorite(favoritePerson.id, "person")
                        }
                        className={s["favorite__remove"]}
                      >
                        削除
                      </Button>
                    </div>
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
      <ScrollButton onClick={scrollToTop} />
    </>
  );
}
