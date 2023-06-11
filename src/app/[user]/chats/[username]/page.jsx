"use client";

import style from "../../../../styles/ChattingPage.module.css";
import LoadingComponent from "@/components/LoadingComponent";
import ChatItemComponent from "@/components/ChatItemComponent";
import storage from "@/Database/firebaseConfig.js";

import { BsArrowLeft } from "react-icons/bs";
import { BiUser } from "react-icons/bi";
import { CiMenuKebab } from "react-icons/ci";
import { MdSend } from "react-icons/md";
import { GrAttachment } from "react-icons/gr";
import {
  BsImage,
  BsHeadset,
  BsCameraVideo,
  BsFiletypePdf,
  BsFillCloudUploadFill,
} from "react-icons/bs";

import useSWR from "swr";
import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  // deleteObject,
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

  const { data, isLoading } = useSWR(`${URL}/${uName}`, fetcher, {
    refreshInterval: 1000,
  });

  let temp_list = data && data["status"] ? data["data"]["message"] : [];
  let selfId = data && data["status"] && data["selfId"];
  let FriendAvtar = data && data["status"] ? data["avtar"] : "image";

  const [list, set_list] = useState([]);
  const [progress, set_progress] = useState(0);
  const [msgBox, set_msgBox] = useState("");
  const [media, set_media] = useState({
    flag: 0,
    file: null,
    type: "",
    name: "",
    size: "",
    src: "",
  });

  temp_list.length > list.length ? set_list(temp_list) : null;

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

      let mediaUrl = "";

      const storageRef = ref(
        storage,
        `/assets/${selfId}/${uName}/${media.name}`
      );
      const uploadTask = uploadBytesResumable(storageRef, media.file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const percent = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          set_progress(percent);
          console.log(percent);
        },
        (err) => console.log(err),
        () => {
          // download url
          getDownloadURL(uploadTask.snapshot.ref).then(async (url) => {
            mediaUrl = url;
            console.log(url);

            set_list((prev) => [
              ...prev,
              {
                _id: Date.now() * 28,
                author: "SelfHume",
                msg: msg === "" ? "noCapTiOn9463" : msg,
                msgType: "media",
                mediaInfo: {
                  type: media.type,
                  name: media.name,
                  size: media.size,
                  url: mediaUrl,
                },
                time: time,
                date: new Date().toLocaleDateString("pt-PT"),
                seenStauts: false,
              },
            ]);

            const JSONdata = JSON.stringify({
              message: msg === "" ? "noCapTiOn9463" : msg,
              msgType: "media",
              mediaInfo: {
                type: media.type,
                name: media.name,
                size: media.size,
                url: mediaUrl,
              },
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

            set_media({
              flag: 0,
              file: null,
              type: "",
              name: "",
              size: "",
              src: "",
            });

            set_progress(0);
          });
        }
      );

      //
    } //
    else {
      //

      if (msg === "") return;

      set_list((prev) => [
        ...prev,
        {
          _id: Date.now() * 28,
          author: "SelfHume",
          msg: msg,
          msgType: "text",
          mediaInfo: {},
          time: time,
          date: new Date().toLocaleDateString("pt-PT"),
          seenStauts: false,
        },
      ]);

      const JSONdata = JSON.stringify({
        message: msg,
        msgType: "text",
        mediaInfo: {},
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

      //
    }

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
                    style={
                      FriendAvtar === "image"
                        ? {}
                        : {
                            backgroundImage: `url(
                             ${FriendAvtar}
                            )`,
                          }
                    }
                  >
                    {FriendAvtar === "image" ? (
                      <BiUser className={style.icons} />
                    ) : null}
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
                            <BsArrowLeft className={style.icons} /> Back
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
                  />
                )}
              </section>
              {/* Body Part Ends */}

              {/* Footer Part Starts */}
              <section className={style.footer}>
                <form onSubmit={sendChat}>
                  <span className={style.input_cover}>
                    <input
                      type="text"
                      name="msg"
                      id="msgInputBox"
                      placeholder="Message..."
                      autoComplete="off"
                      value={msgBox}
                      onChange={(e) => set_msgBox(e.target.value)}
                    />

                    <span className={style.attachment_cover}>
                      <label htmlFor="attach" className={style.attachBtn}>
                        <GrAttachment className={style.icons} />
                        <input type="radio" name="attach" id="attach" />

                        <span className={style.opt}>
                          <label>
                            <input
                              type="file"
                              name="attach_img"
                              id="attach_img"
                              accept="image/*"
                              hidden
                              onChange={(e) => {
                                let file = e.target.files[0];

                                if (!file) return;
                                set_media((prev) => ({
                                  ...prev,
                                  flag: 1,
                                  file: file,
                                  size: Math.round(file.size / 1024) + " KB",
                                  name: file.name,
                                  type: "image",
                                  src: window.URL.createObjectURL(file),
                                }));
                                console.log(e);
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
                              hidden
                              onChange={(e) => {
                                let file = e.target.files[0];

                                if (!file) return;
                                set_media((prev) => ({
                                  ...prev,
                                  flag: 1,
                                  file: file,
                                  size: Math.round(file.size / 1024) + " KB",
                                  name: file.name,
                                  type: "audio",
                                  src: window.URL.createObjectURL(file),
                                }));
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
                              hidden
                              onChange={(e) => {
                                let file = e.target.files[0];

                                if (!file) return;
                                set_media((prev) => ({
                                  ...prev,
                                  flag: 1,
                                  file: file,
                                  size: Math.round(file.size / 1024) + " KB",
                                  name: file.name,
                                  type: "video",
                                  src: window.URL.createObjectURL(file),
                                }));
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
                              hidden
                              onChange={(e) => {
                                let file = e.target.files[0];

                                if (!file) return;
                                set_media((prev) => ({
                                  ...prev,
                                  flag: 1,
                                  file: file,
                                  size: Math.round(file.size / 1024) + " KB",
                                  name: file.name,
                                  type: "document",
                                  src: window.URL.createObjectURL(file),
                                }));
                              }}
                            />
                            <BsFiletypePdf className={style.icons} />
                          </label>
                        </span>
                      </label>
                    </span>
                  </span>
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
