import style from "../styles/ChatItemComponent.module.css";
import storage from "@/Database/firebaseConfig";

import { CiMenuKebab } from "react-icons/ci";
import { RiCheckDoubleLine, RiCheckLine } from "react-icons/ri";
import { MdNotInterested, MdDelete } from "react-icons/md";
import { BsHeadset, BsCameraVideo, BsFiletypePdf } from "react-icons/bs";

import { useEffect, useRef } from "react";
import { ref, deleteObject } from "firebase/storage";

const ChatItemComponent = ({
  data,
  temp_list,
  list,
  set_list,
  uName,
  chatId,
  chatStatus,
  mutate,
}) => {
  //

  const chatsCover = useRef();

  useEffect(() => {
    if (data) chatsCover.current.scrollTop = chatsCover.current.scrollHeight;
  }, [list]);

  const removeMsg = async (action, item) => {
    //

    let newList = list;

    newList.filter((obj) => {
      if (obj.sendTime != item.sendTime) return obj;
    });

    const JSONdata = JSON.stringify({
      action: action,
      _id: item._id,
      chatId: chatId,
      chatStatus: chatStatus,
    });

    const res = await fetch(`/api/chats/nitesh`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSONdata,
    });

    const resData = await res.json();

    if (resData.status === false) {
      alert(`${resData.msg}`);
      return;
    }

    if (action === "Delete self message" && item.msgType === "media") {
      const path = ref(storage, item.mediaInfo.url);

      deleteObject(path)
        .then(() => {
          console.log("Image is deleted");
        })
        .catch((err) => {
          console.log(err);
        });
    }

    set_list(newList);

    console.log(action + " -> " + "Delete this message.");
    mutate();

    //
  };

  return (
    <div className={style.chats_cover} ref={chatsCover}>
      {(temp_list.length >= list.length ? temp_list : list).map((item) => {
        return (
          <span
            key={item._id}
            className={item.author === uName ? style.msg_left : style.msg_right}
          >
            <span
              className={style.deleteBtn_cover}
              onClick={() => {
                item.author === uName
                  ? removeMsg("Delete your message", item)
                  : removeMsg("Delete self message", item);
              }}
            >
              <CiMenuKebab className={style.icons} />
            </span>

            {item.deleted ? (
              <p className={style.deletedMsg}>
                <i>
                  <MdNotInterested className={style.icons} /> This message was
                  deleted
                </i>
              </p>
            ) : item.msgType === "media" ? (
              item.mediaInfo.type === "image" ? (
                <>
                  <a href={item.mediaInfo.url} target="_blank">
                    <span
                      className={style.mediaMsg_img}
                      style={{
                        backgroundImage: `url(${item.mediaInfo.url})`,
                      }}
                    ></span>
                  </a>
                  {item.msg === "noCapTiOn9463" ? null : <p>{item.msg}</p>}
                </>
              ) : (
                <>
                  <a href={item.mediaInfo.url} target="_blank">
                    <span
                      className={style.mediaMsg}
                      style={
                        item.mediaInfo.type === "audio"
                          ? {
                              borderLeft: "0.14rem solid #ff8c00",
                              borderRight: "0.14rem solid #ff8c00",
                            }
                          : item.mediaInfo.type === "video"
                          ? {
                              borderLeft: "0.14rem solid #ff1493",
                              borderRight: "0.14rem solid #ff1493",
                            }
                          : {
                              borderLeft: "0.14rem solid #dc143c",
                              borderRight: "0.14rem solid #dc143c",
                            }
                      }
                    >
                      {item.mediaInfo.type === "video" ? (
                        <span
                          className={style.icon_cover}
                          style={{
                            backgroundColor: "#ff1493",
                          }}
                        >
                          <BsCameraVideo className={style.icons} />
                        </span>
                      ) : null}
                      {item.mediaInfo.type === "audio" ? (
                        <span
                          className={style.icon_cover}
                          style={{
                            backgroundColor: "#ff8c00",
                          }}
                        >
                          <BsHeadset className={style.icons} />
                        </span>
                      ) : null}
                      {item.mediaInfo.type === "document" ? (
                        <span
                          className={style.icon_cover}
                          style={{
                            backgroundColor: "#dc143c",
                          }}
                        >
                          <BsFiletypePdf className={style.icons} />
                        </span>
                      ) : null}
                      <span className={style.info_cover}>
                        <p>{item.mediaInfo.name}</p>
                        <p>{item.mediaInfo.size}</p>
                        <p>click to view</p>
                      </span>
                    </span>
                  </a>
                  {item.msg === "noCapTiOn9463" ? null : <p>{item.msg}</p>}
                </>
              )
            ) : (
              <>
                {item.msg.match(
                  /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/
                ) ? (
                  <p>
                    <a href={`${item.msg}`} target="_blank">
                      {item.msg}
                    </a>
                  </p>
                ) : (
                  <p>{item.msg}</p>
                )}
              </>
            )}
            <p className={style.msg_time}>
              {`${item.date} - ${item.time}`}
              {item.author != uName ? (
                item.seenStauts ? (
                  <RiCheckDoubleLine className={style.icons} />
                ) : (
                  <RiCheckLine className={style.icons} />
                )
              ) : null}
            </p>
          </span>
        );
      })}
    </div>
  );
};

export default ChatItemComponent;
