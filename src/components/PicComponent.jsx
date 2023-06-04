"use client";

import style from "../styles/PicComponent.module.css";

import { FaUserCircle } from "react-icons/fa";
import { CgCloseO } from "react-icons/cg";
import { BsInfoCircle } from "react-icons/bs";

import { useRouter } from "next/navigation";

const PicComponent = ({ closePopUp, username, avtar }) => {
  const router = useRouter();

  return (
    <>
      {/* Header Section Start hear */}
      <section className={style.header}>
        <span
          className={style.pic_cover}
          style={
            avtar.flag
              ? {
                  backgroundImage: `url(${avtar.avtar})`,
                }
              : {}
          }
        >
          {avtar.flag ? null : <FaUserCircle className={style.icons} />}
        </span>
      </section>
      {/* Header Section End hear */}

      {/* Body Section Start hear */}
      <section className={style.body}>
        <span className={style.btn_cover}>
          <button onClick={() => closePopUp()}>
            close
            <CgCloseO className={style.icons} />
          </button>
          <button onClick={() => router.push(`/profile/${username}`)}>
            more
            <BsInfoCircle className={style.icons} />
          </button>
        </span>
      </section>
      {/* Body Section End hear */}
    </>
  );
};

export default PicComponent;
