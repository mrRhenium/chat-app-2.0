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
// import { RiCheckDoubleLine } from "react-icons/ri";

const URL = `/api/chatList`;
const fetcher = async (url) => {
  const res = await fetch(url);
  const data = await res.json();
  return data;
};

const updateAvtar = async (action, targetUserId, set_friendAvtar) => {
  //

  const JSONdata = JSON.stringify({
    action: action,
    targetUserId: targetUserId,
  });

  const res = await fetch(`/api/profile/targetUser`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSONdata,
  });

  const resData = await res.json();
  if (resData.status === false) alert(`${resData.msg}`);

  set_friendAvtar(resData.avtar);
  // console.log(resData.msg);
  // mutate();
  //
};

const Chats = () => {
  const router = useRouter();

  const [block, set_block] = useState(0);
  const [friendAvtar, set_friendAvtar] = useState("");
  const [showPopUp, set_showPopUp] = useState({ flag: 0, username: "" });

  // Data is fetch from the Server
  const { data, isLoading } = useSWR(URL, fetcher, {
    refreshInterval: 2000,
  });

  // Close the PopUP component
  const closePopUp = () => set_showPopUp((prev) => ({ ...prev, flag: 0 }));

  if (isLoading) {
    return (
      <>
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
                router.push(`/profile/selfUser`);
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
            <LoadingComponent />
          </div>
        </section>
        {/* Chats page Body Part Ends */}
      </>
    );
  }

  const chatList =
    data && data["data"] && data["data"]["friends"].length
      ? data["data"]["friends"]
      : [];
  const selfUser = data && data["data"];

  if (data && data["status"] === false) {
    alert(data["msg"]);
    return;
  }

  // console.log(selfUser);

  return (
    <>
      {showPopUp.flag ? (
        <PopUpComponent closePopUp={closePopUp}>
          <PicComponent
            closePopUp={closePopUp}
            username={showPopUp.username}
            avtar={block ? "image" : friendAvtar}
            // mutate={mutate}
          />
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
            style={
              selfUser.avtar === "image"
                ? {}
                : {
                    backgroundImage: `url(${selfUser.avtar})`,
                  }
            }
            onClick={() => {
              router.push(`/profile/${selfUser.username}`);
            }}
          >
            {selfUser.avtar === "image" ? (
              <BiUser className={style.icons} />
            ) : null}
          </span>
        </div>
      </section>
      {/* Chats page Header Part Ends */}

      {/* Chats page Body Part Starts */}
      <section className={style.body}>
        <div className={style.chatList_cover}>
          {data["status"] === false ? (
            // alert(`${resMsg}`),
            router.push("/logIn")
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
                    onClick={() => {
                      item.blockStatus ? set_block(1) : set_block(0);
                      set_friendAvtar(item.avtar);
                      updateAvtar("Update Avtar", item.userId, set_friendAvtar);

                      set_showPopUp({ flag: 1, username: item.username });
                    }}
                  >
                    <span
                      className={style.chat_pic}
                      style={
                        item.avtar === "image" || item.blockStatus
                          ? {}
                          : {
                              backgroundImage: `url(${item.avtar})`,
                            }
                      }
                    >
                      {item.avtar === "image" || item.blockStatus ? (
                        <FaUserCircle className={style.icons} />
                      ) : null}
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
                      <span>
                        <p>{item.username}</p>
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

  //
};

export default Chats;
