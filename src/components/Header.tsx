"use client";
import s from "./Header.module.scss";
import { FaHeart } from "react-icons/fa";
import { RiHomeSmileFill } from "react-icons/ri";

const Header = () => {
  return (
    <header className={s["header"]}>
      <div className={s["header__inner"]}>
        <a href="/" className={s["home"]}>
          <RiHomeSmileFill className={s["home__icon"]} />
          <p className={s["home__text"]}>HOME</p>
        </a>
        <a className={s["favorite"]} href="/favorites">
          <FaHeart className={s["favorite__icon"]} />
          <p className={s["favorite__text"]}>FAVORITE</p>
        </a>
      </div>
    </header>
  );
};

export default Header;
