"use client";

import style from "../../../../styles/ChattingPage.module.css";
import LoadingComponent from "@/components/LoadingComponent";
import ChatItemComponent from "@/components/ChatItemComponent";
import storage from "@/Database/firebaseConfig.js";
import PopUpComponent from "@/components/PopUpComponent";

import { BiBlock } from "react-icons/bi";
import { FaUserCircle } from "react-icons/fa";
import { BiUser } from "react-icons/bi";
import { CiMenuKebab } from "react-icons/ci";
import { GrAttachment } from "react-icons/gr";
import { CgCloseO } from "react-icons/cg";
import {
  MdSend,
  MdDelete,
  MdReplyAll,
  MdDeleteForever,
  MdWallpaper,
  MdOutlineRemoveCircleOutline,
} from "react-icons/md";
import {
  BsArrowLeft,
  BsImage,
  BsHeadset,
  BsCameraVideo,
  BsFiletypePdf,
  BsTextareaT,
  BsFillCloudUploadFill,
} from "react-icons/bs";

import useSWR from "swr";
import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

//
//

const URL = `/api/chats/`;
const fetcher = async (url) => {
  const res = await fetch(url);
  const data = await res.json();
  return data;
};

const ChattingPage = () => {
  const router = useRouter();
  let uName = useParams().username;

  const { data, isLoading, mutate } = useSWR(`${URL}/${uName}`, fetcher, {
    refreshInterval: 1000,
  });

  let temp_list = data && data["status"] ? data["data"] : [];
  let selfId = data && data["status"] && data["selfId"];
  let targetUserId = data && data["status"] && data["targetUserId"];
  let selfUsername = data && data["status"] && data["selfUsername"];
  let wallpaper = data && data["status"] && data["wallpaper"];
  let chatId = data && data["status"] && data["chatId"];
  let blockStatus = data && data["status"] && data["blockStatus"];
  let chatStatus = data && data["status"] && data["chatStatus"];
  let FriendAvtar = data && data["status"] ? data["avtar"] : "image";
  let rootBlockStatus = data && data["status"] && data["rootBlockStatus"];

  const [list, set_list] = useState([]);
  const [progress, set_progress] = useState(0);
  const [mediaOpt, set_mediaOpt] = useState(0);
  const [uploadStart, set_uploadStart] = useState(0);
  const [msgBox, set_msgBox] = useState("");
  const [showPopUp, set_showPopUp] = useState(0);
  const [chatItem, set_chatItem] = useState();
  const [deletedChat, set_deletedChat] = useState([]);
  const [headerOpt, set_headerOpt] = useState(0);
  const [uploadCancel, set_uploadCancel] = useState(() => {
    return () => {
      console.log("Cancel");
    };
  });

  const [reaction, set_reaction] = useState({
    flag: 0,
    data: {
      type: "none",
      name: "none",
      file: "none",
      url: "none",
    },
  });

  const [media, set_media] = useState({
    flag: 0,
    file: null,
    type: "",
    name: "",
    size: "",
    src: "",
  });

  temp_list.length > list.length ? set_list(temp_list) : null;

  let chatList = temp_list.length >= list.length ? temp_list : list;

  const closePopUp = () => set_showPopUp(0);

  const removeWallpaper = async (action) => {
    //

    const JSONdata = JSON.stringify({
      action: action,
      targetUserId: targetUserId,
    });

    const res = await fetch(`/api/users`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSONdata,
    });

    const resData = await res.json();
    if (resData.status === false) alert(`kya hai ye, ${resData.msg}`);

    // Delete from firebase
    const path = ref(storage, wallpaper);
    deleteObject(path)
      .then(() => {
        console.log("Wallpaper is deleted");
        set_headerOpt(0);
      })
      .catch((err) => {
        console.log(err);
      });

    //
  };

  const postWallpaper = async (e, action) => {
    //

    let imgUrl = "image";
    let img = e.target.files[0];
    // let imgName = e.target.files[0].name.split(" ").join("");

    if (!img) {
      alert("Please upload an image first!");
      return;
    }

    if (img.name.includes(" ")) {
      alert("Image name should not contain any space.");
      return;
    }

    const storageRef = ref(
      storage,
      `/assets/${selfId}/${targetUserId}/${img.name}`
    );
    const uploadTask = uploadBytesResumable(storageRef, img);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const percent = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );

        console.log(percent);
      },
      (err) => console.log(err),
      () => {
        // download url
        getDownloadURL(uploadTask.snapshot.ref).then(async (url) => {
          imgUrl = url;
          console.log(url);

          const JSONdata = JSON.stringify({
            action: action,
            imgUrl: imgUrl,
            targetUserId: targetUserId,
          });

          const res = await fetch(`/api/users`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSONdata,
          });

          const resData = await res.json();
          if (resData.status === false) alert(`${resData.msg}`);

          console.log("Wallpaper is updated.");
          set_headerOpt(0);
        });
      }
    );

    //
  };

  const putRequestBlocked = async (action, targetUserId) => {
    //

    const JSONdata = JSON.stringify({
      action: action,
      targetUserId: targetUserId,
    });

    const res = await fetch(`/api/profile/sal`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSONdata,
    });

    const resData = await res.json();
    if (resData.status === false) alert(`${resData.msg}`);

    mutate();
    //
  };

  const clearAllChats = async (action) => {
    //

    // let ClearAllChatList = [...deletedChat];

    // chatList.map((item) => {
    //   ClearAllChatList.push(item.sendTime);
    // });

    // set_deletedChat(ClearAllChatList);

    const JSONdata = JSON.stringify({
      action: action,
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

    router.push("/user/chats");

    // mutate();
  };

  const removeMsg = async (action, item) => {
    //

    set_deletedChat((prev) => [...prev, item.sendTime]);

    const JSONdata = JSON.stringify({
      action: action,
      sendTime: item.sendTime,
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

    console.log(action + " -> " + "Delete this message.");

    //
  };

  const sendChat = async (e) => {
    //
    e.preventDefault();

    let msg = msgBox;
    set_msgBox("");

    if (blockStatus) {
      alert("Access to this user is Prohibited!");
      return;
    }

    let time = new Date().toLocaleString("en-US", {
      hour12: true,
      hour: "2-digit",
      minute: "2-digit",
    });

    const reactionData = reaction;
    set_reaction({
      flag: 0,
      data: {
        type: "none",
        name: "none",
        file: "none",
        url: "none",
      },
    });

    if (media.flag) {
      //

      if (media.file === null) {
        set_media({
          flag: 0,
          file: null,
          type: "",
          name: "",
          size: "",
        });

        return;
      }

      if (media.type === "image" && media.name.match(/[\(\)\[\]\{\}]/)) {
        alert("Image name is not supported, Please!! change the image name.");
        return;
      }

      if (media.size > 2048) {
        alert("File size should be less than 2 GB");
        return;
      }

      set_uploadStart(1);

      let mediaUrl = "";

      const storageRef = ref(
        storage,
        `/assets/${selfId}/${uName}/${media.name}`
      );

      const uploadTask = uploadBytesResumable(storageRef, media.file);

      // Defining the upload Cancel function here.
      set_uploadCancel(() => {
        return () => {
          uploadTask.cancel();

          set_media({
            flag: 0,
            file: null,
            type: "",
            name: "",
            size: "",
            src: "",
          });

          set_uploadStart(0);
          set_progress(0);

          console.log("Proper cancel");
        };
      });

      // ******************************************************
      const sendTime = Date.now();

      set_list((prev) => [
        ...prev,
        {
          _id: Date.now() * 28,
          sendTime: sendTime,
          author: "SelfHume",
          msg: msg === "" ? "noCapTiOn9463" : msg,
          msgType: "media",
          mediaInfo: {
            type: media.type,
            name: media.name,
            size: media.size,
            url: media.src,
          },
          reaction: reactionData.data,
          time: time,
          date: new Date().toLocaleDateString("pt-PT"),
          seenStauts: false,
          temp: true,
        },
      ]);
      // ******************************************************

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const percent = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          set_progress(percent);
          // console.log(percent);
        },
        (err) => console.log(err),
        () => {
          // download url
          getDownloadURL(uploadTask.snapshot.ref).then(async (url) => {
            mediaUrl = url;
            // console.log(url);

            //

            //
            const JSONdata = JSON.stringify({
              sendTime: sendTime,
              message: msg === "" ? "noCapTiOn9463" : msg,
              msgType: "media",
              mediaInfo: {
                type: media.type,
                name: media.name,
                size: media.size,
                url: mediaUrl,
              },
              reaction: reactionData.data,
              time: time,
              chatId: chatId,
              userId: selfId,
              username: selfUsername,
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

            set_media({
              flag: 0,
              file: null,
              type: "",
              name: "",
              size: "",
              src: "",
            });

            set_uploadStart(0);
            set_progress(0);
          });
        }
      );

      //
    } //
    else {
      //
      msgInputBox.focus();

      if (msg === "") return;

      const sendTime = Date.now();

      set_list((prev) => [
        ...prev,
        {
          _id: Date.now() * 28,
          sendTime: sendTime,
          author: "SelfHume",
          msg: msg,
          msgType: "text",
          mediaInfo: {},
          reaction: reactionData.data,
          time: time,
          date: new Date().toLocaleDateString("pt-PT"),
          seenStauts: false,
        },
      ]);

      const JSONdata = JSON.stringify({
        sendTime: sendTime,
        message: msg,
        msgType: "text",
        mediaInfo: {},
        reaction: reactionData.data,
        time: time,
        chatId: chatId,
        userId: selfId,
        username: selfUsername,
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

      msgInputBox.focus();

      //
    }

    //
  };

  return (
    <>
      {showPopUp ? (
        <PopUpComponent closePopUp={closePopUp}>
          <section className={style.chatOptions_cover}>
            {/*  */}

            {chatItem.deleted ? null : (
              <button
                className={style.optionItem}
                onClick={() => {
                  set_reaction({
                    flag: 1,
                    data: {
                      type: chatItem.msgType === "text" ? "Text" : "media",
                      name:
                        chatItem.msgType === "text"
                          ? chatItem.msg
                          : chatItem.mediaInfo.name +
                            " : " +
                            chatItem.mediaInfo.size,
                      file:
                        chatItem.msgType === "media"
                          ? chatItem.mediaInfo.type
                          : "Text",
                      url:
                        chatItem.msgType === "media"
                          ? chatItem.mediaInfo.url
                          : "none",
                    },
                  });

                  closePopUp();
                }}
              >
                <MdReplyAll className={style.icons} />
                Reply this message
              </button>
            )}

            <button
              className={style.optionItem}
              onClick={() => {
                chatItem.author === uName
                  ? removeMsg("Delete your message", chatItem)
                  : removeMsg("Delete self message for self", chatItem);

                closePopUp();
              }}
            >
              <MdDelete className={style.icons} />
              Delete for me
            </button>

            {Date.now() - parseInt(chatItem.sendTime) < 86400000 &&
            chatItem.author !== uName ? (
              // (console.log(`${Date.now()} - ${parseInt(chatItem.sendTime)} ->
              // ${Date.now() - parseInt(chatItem.sendTime)}`),
              <button
                className={style.optionItem}
                onClick={() => {
                  removeMsg("Delete self message for everyone", chatItem);

                  closePopUp();
                }}
              >
                <MdDeleteForever className={style.icons} />
                Delete for everyone
              </button>
            ) : // )
            null}

            {/*  */}
          </section>
        </PopUpComponent>
      ) : null}

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
                    style={
                      FriendAvtar === "image" || blockStatus
                        ? {}
                        : {
                            backgroundImage: `url(
                             ${FriendAvtar}
                            )`,
                          }
                    }
                  >
                    {FriendAvtar === "image" || blockStatus ? (
                      <BiUser className={style.icons} />
                    ) : null}
                  </span>
                  <span
                    className={style.name_info}
                    onClick={() => {
                      router.push(`/profile/${uName}`);
                    }}
                  >
                    <p className={style.name}>{uName}</p>
                    <p className={style.live_status}>
                      {blockStatus
                        ? "Blocked"
                        : data["onlineStatus"] === true
                        ? "online"
                        : "offline"}
                    </p>
                  </span>
                </div>
                <div className={style.right_cover}>
                  <span
                    onClick={() => {
                      set_headerOpt(1);
                    }}
                  >
                    <CiMenuKebab className={style.icons} />
                  </span>
                  {/*  */}

                  {headerOpt ? (
                    <div className={style.opt_cover}>
                      <span
                        onClick={() => {
                          router.push(`/profile/${uName}`);
                          set_headerOpt(0);
                        }}
                      >
                        <FaUserCircle className={style.icons} />
                        View Contact
                      </span>
                      {/*  */}
                      {rootBlockStatus ? (
                        <span
                          onClick={() => {
                            putRequestBlocked("Unblock User", targetUserId);
                            set_headerOpt(0);
                          }}
                        >
                          <BiBlock className={style.icons} />
                          Unblock User
                        </span>
                      ) : (
                        <span
                          onClick={() => {
                            putRequestBlocked("Block User", targetUserId);
                            set_headerOpt(0);
                          }}
                        >
                          <BiBlock className={style.icons} />
                          Block User
                        </span>
                      )}
                      {/*  */}

                      {wallpaper === "image" ? (
                        <span>
                          <label htmlFor="wallpaper">
                            <input
                              type="file"
                              name="wallpaper"
                              id="wallpaper"
                              onChange={(e) => {
                                postWallpaper(e, "Update specific Wallpaper");
                              }}
                            />
                            <MdWallpaper className={style.icons} />
                            Wallpaper
                          </label>
                        </span>
                      ) : (
                        <span
                          onClick={() => {
                            removeWallpaper("Remove specific Wallpaper");
                          }}
                        >
                          <MdOutlineRemoveCircleOutline
                            className={style.icons}
                          />
                          Wallpaper
                        </span>
                      )}

                      <span
                        onClick={() => {
                          clearAllChats("Clear all chats");
                          set_headerOpt(0);
                        }}
                      >
                        <MdDeleteForever className={style.icons} />
                        Clear chats
                      </span>

                      <span
                        onClick={() => {
                          set_headerOpt(0);
                        }}
                      >
                        Close
                      </span>
                    </div>
                  ) : null}

                  {/*  */}
                </div>
              </section>
              {/* Header Part Ends */}

              {/* Body Part Starts */}
              <section className={style.body}>
                {media.flag ? (
                  <>
                    <div className={style.mediaSection}>
                      <div className={style.upper_part}>
                        <span className={style.item_cover}>
                          <span
                            className={style.backBtn}
                            onClick={() => {
                              set_media({
                                flag: 0,
                                file: null,
                                type: "",
                                name: "",
                                size: "",
                                src: "",
                              });
                            }}
                          >
                            <CgCloseO className={style.icons} />
                          </span>

                          {/* Image */}
                          {media.type === "image" ? (
                            <span
                              className={style.imageItem}
                              style={{
                                backgroundImage: `url(${media.src})`,
                              }}
                            ></span>
                          ) : null}

                          {/* Audio */}
                          {media.type === "audio" ? (
                            <span className={style.audioItem}>
                              <span className={style.audioIcon_cover}>
                                <span className={style.audioIcon}>
                                  <BsHeadset className={style.icons} />
                                </span>
                              </span>
                              <span className={style.audioControler}>
                                <audio controls>
                                  <source src={media.src} type="audio/mpeg" />
                                </audio>
                              </span>
                            </span>
                          ) : null}

                          {/* Video */}
                          {media.type === "video" ? (
                            <span className={style.videoItem}>
                              <video controls>
                                <source src={media.src} type="video/mp4" />
                              </video>
                            </span>
                          ) : null}

                          {/* Document */}
                          {media.type === "document" ? (
                            <span className={style.docItem}>
                              <embed src={media.src} type="application/pdf" />
                            </span>
                          ) : null}
                        </span>
                      </div>
                      <div className={style.lower_part}>
                        <span className={style.icon_cover}>
                          <BsFillCloudUploadFill className={style.icons} />
                        </span>
                        <span className={style.info_cover}>
                          <p>{media.name}</p>
                          <p>{`${media.type} : ${media.size}`}</p>
                          <span className={style.loading_cover}>
                            <span
                              className={style.progressBar}
                              style={{ width: `${progress}%` }}
                            ></span>
                          </span>
                        </span>
                      </div>
                    </div>
                  </>
                ) : (
                  <ChatItemComponent
                    data={data}
                    temp_list={temp_list}
                    list={list}
                    uName={uName}
                    set_chatItem={set_chatItem}
                    set_showPopUp={set_showPopUp}
                    deletedChat={deletedChat}
                    chatList={chatList}
                    wallpaper={wallpaper}
                    progress={progress}
                    uploadCancel={uploadCancel}
                  />
                )}
              </section>
              {/* Body Part Ends */}

              {/* Footer Part Starts */}
              <section className={style.footer}>
                <form onSubmit={sendChat}>
                  <span className={style.input_cover}>
                    {/*  */}
                    {reaction.flag ? (
                      <div className={style.reaction_section}>
                        <span
                          className={style.closeBtn}
                          onClick={() => {
                            set_reaction({
                              flag: 0,
                              data: {
                                type: "none",
                                name: "none",
                                file: "none",
                                url: "none",
                              },
                            });
                          }}
                        >
                          <CgCloseO className={style.icons} />
                        </span>

                        <span
                          className={style.reaction_cover}
                          style={
                            reaction.data.type === "Text"
                              ? {
                                  borderLeft: "0.16rem solid #f08080",
                                  borderRight: "0.16rem solid #f08080",
                                }
                              : reaction.data.file === "image"
                              ? {
                                  borderLeft: "0.16rem solid #32cd32",
                                  borderRight: "0.16rem solid #32cd32",
                                }
                              : reaction.data.file === "audio"
                              ? {
                                  borderLeft: "0.16rem solid #ff8c00",
                                  borderRight: "0.16rem solid #ff8c00",
                                }
                              : reaction.data.file === "video"
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
                            <p>{`${reaction.data.file} : ${reaction.data.name}`}</p>
                          </span>
                          <span className={style.right_cover}>
                            {/*  */}

                            {reaction.data.type === "Text" ? (
                              <span
                                className={style.item_cover}
                                style={{
                                  backgroundColor: "#f08080",
                                }}
                              >
                                <BsTextareaT className={style.icons} />
                              </span>
                            ) : reaction.data.file === "image" ? (
                              <span
                                className={style.item_cover}
                                style={{
                                  backgroundImage: `url(${reaction.data.url})`,
                                }}
                              >
                                {/* <BsImage className={style.icons} /> */}
                              </span>
                            ) : reaction.data.file === "audio" ? (
                              <span
                                className={style.item_cover}
                                style={{
                                  backgroundColor: "#ff8c00",
                                }}
                              >
                                <BsHeadset className={style.icons} />
                              </span>
                            ) : reaction.data.file === "video" ? (
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
                      </div>
                    ) : null}
                    {/*  */}

                    <input
                      type="text"
                      name="msg"
                      id="msgInputBox"
                      placeholder="Message..."
                      autoComplete="off"
                      value={msgBox}
                      onChange={(e) => set_msgBox(e.target.value)}
                      readOnly={uploadStart && media.flag ? true : false}
                    />

                    {uploadStart && media.flag ? null : (
                      <span className={style.attachment_cover}>
                        <label htmlFor="attach" className={style.attachBtn}>
                          {mediaOpt ? (
                            <CgCloseO
                              className={style.icons}
                              onClick={() => set_mediaOpt(0)}
                            />
                          ) : (
                            <GrAttachment
                              className={style.icons}
                              onClick={() => set_mediaOpt(1)}
                            />
                          )}
                          {mediaOpt ? (
                            <span className={style.opt}>
                              <label>
                                <input
                                  type="file"
                                  name="attach_img"
                                  id="attach_img"
                                  accept="image/*"
                                  onChange={(e) => {
                                    let file = e.target.files[0];

                                    if (!file) return;
                                    set_media((prev) => ({
                                      ...prev,
                                      flag: 1,
                                      file: file,
                                      size:
                                        Math.round(file.size / 1048576).toFixed(
                                          3
                                        ) + " MB",
                                      name: file.name,
                                      type: "image",
                                      src: window.URL.createObjectURL(file),
                                    }));

                                    set_mediaOpt(0);
                                  }}
                                />
                                <BsImage className={style.icons} />
                              </label>
                              <label>
                                <input
                                  type="file"
                                  name="attach_audio"
                                  id="attach_audio"
                                  accept="audio/*"
                                  onChange={(e) => {
                                    let file = e.target.files[0];

                                    if (!file) return;
                                    set_media((prev) => ({
                                      ...prev,
                                      flag: 1,
                                      file: file,
                                      size:
                                        Math.round(file.size / 1048576).toFixed(
                                          3
                                        ) + " MB",
                                      name: file.name,
                                      type: "audio",
                                      src: window.URL.createObjectURL(file),
                                    }));

                                    set_mediaOpt(0);
                                  }}
                                />
                                <BsHeadset className={style.icons} />
                              </label>
                              <label>
                                <input
                                  type="file"
                                  name="attach_video"
                                  id="attach_video"
                                  accept="video/*"
                                  onChange={(e) => {
                                    let file = e.target.files[0];

                                    if (!file) return;
                                    set_media((prev) => ({
                                      ...prev,
                                      flag: 1,
                                      file: file,
                                      size:
                                        Math.round(file.size / 1048576).toFixed(
                                          3
                                        ) + " MB",
                                      name: file.name,
                                      type: "video",
                                      src: window.URL.createObjectURL(file),
                                    }));

                                    set_mediaOpt(0);
                                  }}
                                />
                                <BsCameraVideo className={style.icons} />
                              </label>
                              <label>
                                <input
                                  type="file"
                                  name="attach_pdf"
                                  id="attach_pdf"
                                  accept="application/pdf"
                                  onChange={(e) => {
                                    let file = e.target.files[0];

                                    if (!file) return;
                                    set_media((prev) => ({
                                      ...prev,
                                      flag: 1,
                                      file: file,
                                      size:
                                        Math.round(file.size / 1048576).toFixed(
                                          3
                                        ) + " MB",
                                      name: file.name,
                                      type: "document",
                                      src: window.URL.createObjectURL(file),
                                    }));

                                    set_mediaOpt(0);
                                  }}
                                />
                                <BsFiletypePdf className={style.icons} />
                              </label>
                            </span>
                          ) : null}

                          {/*  */}
                        </label>
                      </span>
                    )}
                  </span>
                  {/*  */}

                  {/*  */}
                  <label className={style.sendBtn_cover}>
                    {uploadStart && media.flag ? (
                      <span
                        onClick={() => {
                          {
                            uploadCancel;
                          }
                        }}
                      >
                        <CgCloseO className={style.icons} />
                      </span>
                    ) : (
                      <button type="submit">
                        <MdSend className={style.icons} />
                      </button>
                    )}
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
