"use client";

import style from "../../../../styles/ProfilePage.module.css";

import { CiMenuKebab } from "react-icons/ci";
import { BsArrowLeft } from "react-icons/bs";
import { useRouter } from "next/navigation";

const Picture = ({ item }) => {
  const router = useRouter();

  return (
    <>
      <section className={style.header}>
        <div className={style.left_cover}>
          <span
            className={style.back_btn}
            onClick={() => {
              router.back();
            }}
          >
            <BsArrowLeft className={style.icons} />
          </span>
          <span className={style.name_info}>
            <p className={style.name}>{item.username}</p>
          </span>
        </div>
        <div className={style.right_cover}>
          <span className={style.opt}>
            <CiMenuKebab className={style.icons} />
          </span>
        </div>
      </section>
      {/* Profil Page Header Part Start */}

      {/* Profil Page Body Part Start */}
      <section className={style.body}></section>
      {/* Profil Page Body Part Start */}
    </>
  );
};

export default Picture;
