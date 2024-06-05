"use client";
import s from "./Header.module.scss";
import Image from "next/image";

const Header = () => {
  return (
    <header className={s["header"]}>
      <a href="/" className={s["header__top"]}>
        <Image src="/home.svg" alt="" width={30} height={30} />
        <p>HOME</p>
      </a>
    </header>
  );
};

export default Header;
