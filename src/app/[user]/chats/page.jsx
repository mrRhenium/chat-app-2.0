"use client";

import style from "../../../styles/Chats.module.css";
import img from "../../../../public/LOGO (2).png";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import useSWR from "swr";

import LoadingComponent from "@/components/LoadingComponent";
import PopUpComponent from "@/components/PopUpComponent";
import PicComponent from "@/components/PicComponent";

import { BiUser } from "react-icons/bi";
import { FaUserCircle } from "react-icons/fa";
import { RiCheckDoubleLine } from "react-icons/ri";

const URL = `/api/chatList`;
const fetcher = async (url) => {
  const res = await fetch(url);
  const data = await res.json();
  return data;
};

const Chats = () => {
  const router = useRouter();
  const [showPopUp, set_showPopUp] = useState({ flag: 0, username: "" });

  // Data is fetch from the Server
  const { data, isLoading } = useSWR(URL, fetcher);

  const resMsg = data && data["msg"];
  const chatList =
    data && data["data"]["friends"].length ? data["data"]["friends"] : [];
  const selfUser = data && data["data"];

  // Close the PopUP component
  const closePopUp = () => set_showPopUp((prev) => ({ ...prev, flag: 0 }));

  return (
    <>
      {showPopUp.flag ? (
        <PopUpComponent closePopUp={closePopUp}>
          <PicComponent closePopUp={closePopUp} username={showPopUp.username} />
        </PopUpComponent>
      ) : null}

      {/* Chats page Header Part Starts */}
      <section className={style.header}>
        <div className={style.logo_cover}>
          <Image
            src={img}
            alt="app logo"
            width={300}
            height={300}
            className={style.logo}
          />
        </div>
        <div className={style.userProfile_cover}>
          <span
            className={style.user_profile}
            onClick={() => {
              router.push(`/profile/${selfUser.username}`);
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
          {isLoading ? (
            <LoadingComponent />
          ) : data["status"] === false ? (
            alert(`${resMsg}`)
          ) : chatList.length === 0 ? (
            <>
              <h5>
                You don't have any friends, make a friend first and then enjoy
                world fastest & safest messaging platform
              </h5>
            </>
          ) : (
            chatList.map((item) => {
              return (
                <div key={item.username} className={style.chat_list_items}>
                  <span
                    className={style.chatPic_cover}
                    onClick={() =>
                      set_showPopUp({ flag: 1, username: item.username })
                    }
                  >
                    <span className={style.chat_pic}>
                      <FaUserCircle className={style.icons} />
                    </span>
                  </span>
                  <span
                    className={style.chatInfo_cover}
                    onClick={() => {
                      router.push(`/user/chats/${item.username}`);
                    }}
                  >
                    <span className={style.chat_name}>
                      <p>{item.username}</p>
                    </span>
                    <span className={style.chat_msg_highlight}>
                      {/* <span>
                        <RiCheckDoubleLine className={style.icons} />
                      </span> */}
                      <span>
                        <p>{item.lastMsg}</p>
                      </span>
                    </span>
                  </span>
                  <span
                    className={style.chatBadge_cover}
                    onClick={() => {
                      router.push(`/user/chats/${item.username}`);
                    }}
                  >
                    {item.count === 0 ? null : (
                      <span className={style.chat_badge}>
                        <p>{item.count}</p>
                      </span>
                    )}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </section>
      {/* Chats page Body Part Ends */}
    </>
  );
};

export default Chats;
