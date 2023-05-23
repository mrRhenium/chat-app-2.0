"use client";

import style from "../../../styles/Setting.module.css";
import LogOutComponent from "@/components/LogOutComponent";
import DeleteAcComponent from "@/components/DeleteAcComponent";
import PopUpComponent from "@/components/PopUpComponent";

import { BiLogOut, BiLockOpenAlt, BiSupport } from "react-icons/bi";
import { FaRegUserCircle, FaPowerOff } from "react-icons/fa";
import { BsInfoCircle } from "react-icons/bs";
import { VscUnmute } from "react-icons/vsc";
import { MdOutlineNotificationsNone, MdOutlineColorLens } from "react-icons/md";

import { useState } from "react";
import { useRouter } from "next/navigation";

const Setting = () => {
  const router = useRouter();
  const [popUpMsg, set_popUpMsg] = useState("");

  const closePopUp = () => set_popUpMsg("");
  return (
    <>
      {popUpMsg === "logOut" ? (
        <PopUpComponent closePopUp={closePopUp}>
          <LogOutComponent closePopUp={closePopUp} />
        </PopUpComponent>
      ) : null}

      {popUpMsg === "deleteAc" ? (
        <PopUpComponent closePopUp={closePopUp}>
          <DeleteAcComponent closePopUp={closePopUp} />
        </PopUpComponent>
      ) : null}

      <section className={style.header}>
        <h1>{`Setting & Privacy`}</h1>
      </section>
      <section className={style.body}>
        <div className={style.settingItem_cover}>
          {/*  */}

          {/* Setting Option Start Here */}
          <span className={style.account_cover}>
            <strong>Your Account</strong>
            <button
              onClick={() => {
                router.push("/profile/nit");
              }}
            >
              <FaRegUserCircle className={style.icons} />
              My profile
            </button>
            <button
              className={style.redBtn}
              onClick={() => {
                set_popUpMsg("logOut");
              }}
            >
              <BiLogOut className={style.icons} />
              LogOut
            </button>
          </span>

          <span className={style.theme_cover}>
            <strong>How your application look</strong>

            <button
              onClick={() => {
                router.push("/user/setting/themes");
              }}
            >
              <MdOutlineColorLens className={style.icons} />
              Themes
            </button>
          </span>

          <span className={style.notiOrSound_cover}>
            <strong>How you use application</strong>
            <button
              onClick={() => {
                router.push("/user/setting/notify");
              }}
            >
              <MdOutlineNotificationsNone className={style.icons} />
              Notification
            </button>
            <button
              onClick={() => {
                router.push("/user/setting/sound");
              }}
            >
              <VscUnmute className={style.icons} />
              Sound
            </button>
          </span>

          <span className={style.privacy_cover}>
            <strong>Privacy & Security</strong>
            <button
              onClick={() => {
                router.push("/user/setting/privacy");
              }}
            >
              <BiLockOpenAlt className={style.icons} />
              Private Account
            </button>
          </span>

          <span className={style.moreInfo_cover}>
            <strong>More Info. & Support</strong>
            <button
              onClick={() => {
                router.push("/user/setting/help");
              }}
            >
              <BiSupport className={style.icons} />
              Help
            </button>
            <button
              onClick={() => {
                router.push("/user/setting/about");
              }}
            >
              <BsInfoCircle className={style.icons} />
              About
            </button>
          </span>

          <span className={style.dangerZone_cover}>
            <strong>Danger Zone</strong>
            <button
              className={style.redBtn}
              onClick={() => {
                set_popUpMsg("deleteAc");
              }}
            >
              <FaPowerOff className={style.icons} />
              Delete Account
            </button>
          </span>
          {/* Setting Option End Here */}

          {/*  */}
        </div>
      </section>
    </>
  );
};

export default Setting;
