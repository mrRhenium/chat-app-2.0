"use client";

import style from "../../../styles/Setting.module.css";

import { BiLogOut } from "react-icons/bi";
import { BiLockOpenAlt } from "react-icons/bi";
import { BiSupport } from "react-icons/bi";
import { BiBadgeCheck } from "react-icons/bi";
import { FaRegUserCircle } from "react-icons/fa";
import { FaPowerOff } from "react-icons/fa";
import { BsSun } from "react-icons/bs";
import { BsMoon } from "react-icons/bs";
import { BsInfoCircle } from "react-icons/bs";
import { MdOutlineNotificationsNone } from "react-icons/md";
import { VscUnmute } from "react-icons/vsc";
import { useRouter } from "next/navigation";

const Setting = () => {
  const router = useRouter();

  return (
    <>
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
            <button className={style.redBtn}>
              <BiLogOut className={style.icons} />
              LogOut
            </button>
          </span>

          <span className={style.theme_cover}>
            <strong>Theme of application</strong>
            <button>
              <BsSun className={style.icons} />
              Light
              <BiBadgeCheck className={style.checkIcon} />
            </button>
            <button>
              <BsMoon className={style.icons} />
              Dark
            </button>
          </span>

          <span className={style.notiOrSound_cover}>
            <strong>How you use application</strong>
            <button>
              <MdOutlineNotificationsNone className={style.icons} />
              Notification
            </button>
            <button>
              <VscUnmute className={style.icons} />
              Sound
            </button>
          </span>

          <span className={style.privacy_cover}>
            <strong>Privacy & Security</strong>
            <button>
              <BiLockOpenAlt className={style.icons} />
              Private Account
            </button>
          </span>

          <span className={style.moreInfo_cover}>
            <strong>More Info. & Support</strong>
            <button>
              <BiSupport className={style.icons} />
              Help
            </button>
            <button>
              <BsInfoCircle className={style.icons} />
              About
            </button>
          </span>

          <span className={style.dangerZone_cover}>
            <strong>Danger Zone</strong>
            <button className={style.redBtn}>
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
