import style from "../styles/ChatItemComponent.module.css";

import { CiMenuKebab } from "react-icons/ci";
import { MdNotInterested } from "react-icons/md";
import { BsCloudUploadFill } from "react-icons/bs";
import { MdDeleteForever } from "react-icons/md";
import { RiCheckDoubleLine, RiCheckLine } from "react-icons/ri";
import {
  BsHeadset,
  BsCameraVideo,
  BsFiletypePdf,
  BsTextareaT,
} from "react-icons/bs";

import { useEffect, useRef } from "react";

const ChatItemComponent = ({
  data,
  list,
  uName,
  set_chatItem,
  set_showPopUp,
  deletedChat,
  chatList,
  wallpaper,
  progress,
  uploadStart,
}) => {
  //

  const chatsCover = useRef();

  useEffect(() => {
    if (data) chatsCover.current.scrollTop = chatsCover.current.scrollHeight;

    // console.log("new useEffect");
  }, [list]);

  return (
    <>
      <div
        className={style.chats_cover}
        ref={chatsCover}
        style={
          wallpaper === "image"
            ? {}
            : {
                backgroundImage: `url(${wallpaper})`,
              }
        }
      >
        {chatList.map((item) => {
          // console.log(item);

          if (deletedChat.includes(item.sendTime)) return null;

          return (
            <span
              key={item._id}
              className={
                item.author === uName ? style.msg_left : style.msg_right
              }
            >
              {/*  */}

              {item.temp && uploadStart ? (
                <span className={style.uploadStatus_cover}>
                  <strong>
                    <BsCloudUploadFill className={style.icons} />
                    {progress +
                      (progress == 100 ? "% Uploaded" : "% Uploading..")}
                  </strong>
                </span>
              ) : null}

              {/*  */}
              {item.reaction.type !== "none" ? (
                <span className={style.reaction_section}>
                  <span
                    className={style.reaction_cover}
                    style={
                      item.reaction.type === "Text"
                        ? {
                            borderLeft: "0.16rem solid #f08080",
                            borderRight: "0.16rem solid #f08080",
                          }
                        : item.reaction.file === "image"
                        ? {
                            borderLeft: "0.16rem solid #32cd32",
                            borderRight: "0.16rem solid #32cd32",
                          }
                        : item.reaction.file === "audio"
                        ? {
                            borderLeft: "0.16rem solid #ff8c00",
                            borderRight: "0.16rem solid #ff8c00",
                          }
                        : item.reaction.file === "video"
                        ? {
                            borderLeft: "0.16rem solid #ff1493",
                            borderRight: "0.16rem solid #ff1493",
                          }
                        : {
                            borderLeft: "0.16rem solid #dc143c",
                            borderRight: "0.16rem solid #dc143c",
                          }
                    }
                  >
                    <span className={style.left_cover}>
                      <p>{`${item.reaction.file} : ${item.reaction.name}`}</p>
                    </span>
                    <span className={style.right_cover}>
                      {/*  */}

                      {item.reaction.type === "Text" ? (
                        <span
                          className={style.item_cover}
                          style={{
                            backgroundColor: "#f08080",
                          }}
                        >
                          <BsTextareaT className={style.icons} />
                        </span>
                      ) : item.reaction.file === "image" ? (
                        <span
                          className={style.item_cover}
                          style={{
                            backgroundImage: `url(${item.reaction.url})`,
                          }}
                        >
                          {/* <BsImage className={style.icons} /> */}
                        </span>
                      ) : item.reaction.file === "audio" ? (
                        <span
                          className={style.item_cover}
                          style={{
                            backgroundColor: "#ff8c00",
                          }}
                        >
                          <BsHeadset className={style.icons} />
                        </span>
                      ) : item.reaction.file === "video" ? (
                        <span
                          className={style.item_cover}
                          style={{
                            backgroundColor: "#ff1493",
                          }}
                        >
                          <BsCameraVideo className={style.icons} />
                        </span>
                      ) : (
                        <span
                          className={style.item_cover}
                          style={{
                            backgroundColor: "#dc143c",
                          }}
                        >
                          <BsFiletypePdf className={style.icons} />
                        </span>
                      )}

                      {/*  */}
                    </span>
                  </span>
                </span>
              ) : null}

              {/*  */}

              {item.msgType === "media" && item.temp && uploadStart ? (
                <span
                  className={style.deleteBtn_cover}
                  onClick={() => {
                    item.action();
                  }}
                >
                  <MdDeleteForever
                    className={style.icons2}
                    style={{
                      color: `var(--primary_txt1)`,
                      fontSize: "1.6rem",
                    }}
                  />
                </span>
              ) : (
                <span
                  className={style.deleteBtn_cover}
                  onClick={() => {
                    set_chatItem(item);
                    set_showPopUp(1);
                  }}
                >
                  <CiMenuKebab className={style.icons} />
                </span>
              )}
              {/*  */}
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

              {/*  */}
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
    </>
  );
};

export default ChatItemComponent;
