"use client";

import style from "../../../styles/Chats.module.css";
import img from "../../../../public/LOGO (2).png";

import { BiUser } from "react-icons/bi";
import { FaUserCircle } from "react-icons/fa";
import { RiCheckDoubleLine } from "react-icons/ri";

import Image from "next/image";
import { useRouter } from "next/navigation";

const Chats = () => {
  const router = useRouter();

  return (
    <>
      {/* Chats page Header Part Starts */}
      <section className={style.header}>
        <div className={style.logo_cover}>
          <Image
            src={img}
            alt="app logo"
            width={50}
            height={50}
            className={style.logo}
          />
        </div>
        <div className={style.userProfile_cover}>
          <span
            className={style.user_profile}
            onClick={() => {
              router.push("/profile/nit");
            }}
          >
            <BiUser className={style.icons} />
          </span>
        </div>
      </section>
      {/* Chats page Header Part Ends */}

      {/* Chats page Body Part Starts */}
      <section className={style.body}>
        <div className={style.chatList_cover}>
          <div className={style.chat_list_items}>
            <span
              className={style.chatPic_cover}
              onClick={() => {
                router.push("/profile/nit");
              }}
            >
              <span className={style.chat_pic}>
                <FaUserCircle className={style.icons} />
              </span>
            </span>
            <span
              className={style.chatInfo_cover}
              onClick={() => {
                router.push("/user/chats/nit");
              }}
            >
              <span className={style.chat_name}>
                <p>Savita Didi</p>
              </span>
              <span className={style.chat_msg_highlight}>
                <RiCheckDoubleLine className={style.icons} />
                <p>
                  where are you Didi ? dfjkdjfklsdjfkdjf jkfdkfjds fkjsdkfjkj
                </p>
              </span>
            </span>
            <span
              className={style.chatBadge_cover}
              onClick={() => {
                router.push("/user/chats/nit");
              }}
            >
              <span className={style.chat_badge}>
                <p>2</p>
              </span>
            </span>
          </div>
          {/* demo */}
          <div className={style.chat_list_items}>
            <span
              className={style.chatPic_cover}
              onClick={() => {
                router.push("/profile/nit");
              }}
            >
              <span className={style.chat_pic}>
                <FaUserCircle className={style.icons} />
              </span>
            </span>
            <span
              className={style.chatInfo_cover}
              onClick={() => {
                router.push("/user/chats/nit");
              }}
            >
              <span className={style.chat_name}>
                <p>Savita Didi</p>
              </span>
              <span className={style.chat_msg_highlight}>
                <RiCheckDoubleLine className={style.icons} />
                <p>
                  where are you Didi ? dfjkdjfklsdjfkdjf jkfdkfjds fkjsdkfjkj
                </p>
              </span>
            </span>
            <span
              className={style.chatBadge_cover}
              onClick={() => {
                router.push("/user/chats/nit");
              }}
            >
              <span className={style.chat_badge}>
                <p>2</p>
              </span>
            </span>
          </div>
          {/* demo */}
        </div>
      </section>
      {/* Chats page Body Part Ends */}
    </>
  );
};

export default Chats;
