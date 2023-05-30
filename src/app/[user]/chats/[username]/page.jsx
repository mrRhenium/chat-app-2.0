"use client";

import style from "../../../../styles/ChattingPage.module.css";
import LoadingComponent from "@/components/LoadingComponent";

import { BsArrowLeft } from "react-icons/bs";
import { BiUser } from "react-icons/bi";
import { CiMenuKebab } from "react-icons/ci";
import { MdSend } from "react-icons/md";
import { RiCheckDoubleLine, RiCheckLine } from "react-icons/ri";

import useSWR from "swr";
import { useEffect, useRef, useState } from "react";
import { useRouter, useParams } from "next/navigation";
//
//

const URL = `/api/chats/`;
const fetcher = async (url) => {
  const res = await fetch(url);
  const data = await res.json();
  return data;
};

const ChattingPage = () => {
  const chatsCover = useRef();
  const router = useRouter();

  let uName = useParams().username;
  const { data, isLoading, mutate } = useSWR(`${URL}/${uName}`, fetcher, {
    refreshInterval: 1000,
  });

  let temp_list = data && data["status"] ? data["data"]["message"] : [];

  const [list, set_list] = useState([]);
  const [msgBox, set_msgBox] = useState("");

  setInterval(() => {
    temp_list.length > list.length ? set_list(temp_list) : null;
  }, 1000);

  useEffect(() => {
    if (data) chatsCover.current.scrollTop = chatsCover.current.scrollHeight;
  }, [list]);

  const sendChat = async (e) => {
    //
    e.preventDefault();
    msgInputBox.focus();

    let msg = msgBox;
    set_msgBox("");

    let time = new Date().toLocaleString("en-US", {
      hour12: true,
      hour: "2-digit",
      minute: "2-digit",
    });

    if (msg === "") return;

    set_list((prev) => [
      ...prev,
      {
        id: Date.now() * 28,
        author: "SelfHume",
        msg: msg,
        time: time,
        seenStauts: false,
      },
    ]);

    // list.push({
    //   _id: Date.now() * 28,
    //   author: "SelfHume",
    //   msg: msg,
    //   time: time,
    //   seenStauts: false,
    // });

    const JSONdata = JSON.stringify({
      message: msg,
      time: time,
    });

    const res = await fetch(`/api/chats/${uName}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSONdata,
    });

    const resData = await res.json();
    if (resData.status === false) alert(`${resData.msg}`);
    // mutate();
    msgInputBox.focus();

    //
  };

  return (
    <>
      <div className={style.chattingPage}>
        <div className={style.container}>
          {isLoading ? (
            <LoadingComponent />
          ) : data["status"] === false ? (
            (alert(`${data["msg"]}`), router.push("/user/chats"))
          ) : (
            <>
              {/* Header Part Start */}
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
                  <span
                    className={style.pic_info}
                    onClick={() => {
                      router.push(`/profile/${uName}`);
                    }}
                  >
                    <BiUser className={style.icons} />
                  </span>
                  <span className={style.name_info}>
                    <p className={style.name}>{uName}</p>
                    <p className={style.live_status}>
                      {data["onlineStatus"] === true ? "online" : "offline"}
                    </p>
                  </span>
                </div>
                <div className={style.right_cover}>
                  <span className={style.opt}>
                    <CiMenuKebab className={style.icons} />
                  </span>
                </div>
              </section>
              {/* Header Part Ends */}

              {/* Body Part Starts */}
              <section className={style.body}>
                <div className={style.chats_cover} ref={chatsCover}>
                  {list.map((item) => {
                    return (
                      <span
                        key={item._id}
                        className={
                          item.author === uName
                            ? style.msg_left
                            : style.msg_right
                        }
                      >
                        <p>{item.msg}</p>
                        <p className={style.msg_time}>
                          {item.time}

                          {item.author != uName ? (
                            item.seenStauts ? (
                              <RiCheckDoubleLine className={style.icons} />
                            ) : (
                              <RiCheckLine className={style.icons} />
                            )
                          ) : null}

                          {/*  */}
                        </p>
                      </span>
                    );
                  })}
                </div>
              </section>
              {/* Body Part Ends */}

              {/* Footer Part Starts */}
              <section className={style.footer}>
                <form onSubmit={sendChat}>
                  <label className={style.input_cover}>
                    <input
                      type="text"
                      name="msg"
                      id="msgInputBox"
                      placeholder="Message..."
                      autoComplete="off"
                      value={msgBox}
                      onChange={(e) => set_msgBox(e.target.value)}
                    />
                  </label>
                  <label className={style.sendBtn_cover}>
                    <button type="submit">
                      <MdSend className={style.icons} />
                    </button>
                  </label>
                </form>
              </section>
              {/* Footer Part Ends */}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ChattingPage;
