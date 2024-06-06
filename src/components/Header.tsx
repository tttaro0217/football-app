"use client";
import s from "./Header.module.scss";
import ImageWithFallback from "../components/ImageWithFallback";

const Header = () => {
  return (
    <header className={s["header"]}>
      <a href="/" className={s["header__top"]}>
        <ImageWithFallback src="/home.svg" alt="home" width={30} height={30} />
        <p>HOME</p>
      </a>
      <a className={s["header__top"]} href="/favorites">
        <ImageWithFallback
          src="/favorite.svg"
          alt="favorite"
          width={30}
          height={30}
        />
        <p>FAVORITE</p>
      </a>
    </header>
  );
};

export default Header;
