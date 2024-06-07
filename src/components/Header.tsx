"use client";
import s from "./Header.module.scss";
import ImageWithFallback from "../components/ImageWithFallback";
import { FaHeart } from "react-icons/fa";

const Header = () => {
  return (
    <header className={s["header"]}>
      <a href="/" className={s["header__top"]}>
        <ImageWithFallback src="/home.svg" alt="home" width={30} height={30} />
        <p>HOME</p>
      </a>
      <a className={s["favorite"]} href="/favorites">
        <FaHeart className={s["favorite__button"]} />
        <p className={s["favorite__text"]}>FAVORITE</p>
      </a>
    </header>
  );
};

export default Header;
