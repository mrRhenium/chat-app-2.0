import style from "../styles/ProfilePage.module.css";
import storage from "@/Database/firebaseConfig.js";

import { FaUserCircle, FaRegEdit } from "react-icons/fa";
import { BiLogOut, BiBlock } from "react-icons/bi";
import { CiMenuKebab, CiEdit } from "react-icons/ci";
import { MdDeleteForever } from "react-icons/md";
import { BsShieldExclamation, BsArrowLeft, BsQrCodeScan } from "react-icons/bs";

// import { useState } from "react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

//
//

const putRequest = async (action, targetUserId, mutate) => {
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

const removeAvtar = async (action, mutate, set_avtar, imgUrl) => {
  //

  set_avtar("image");

  const JSONdata = JSON.stringify({
    action: action,
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
  const path = ref(storage, imgUrl);
  deleteObject(path)
    .then(() => {
      console.log("Profile Image is deleted");
      mutate();
    })
    .catch((err) => {
      console.log(err);
    });

  //
};

const postAvtar = async (e, userId, action, set_avtar, mutate) => {
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

  set_avtar(window.URL.createObjectURL(img));

  const storageRef = ref(storage, `/assets/${userId}/profile/${img.name}`);
  const uploadTask = uploadBytesResumable(storageRef, img);

  uploadTask.on(
    "state_changed",
    (snapshot) => {
      const percent = Math.round(
        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      );

      // console.log(percent);
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

        console.log("Profile Image is updated.");
        mutate();
      });
    }
  );

  //
};

const ProfileComponent = ({ item, set_showPopUP, msg, status, mutate }) => {
  const router = useRouter();

  const [avtar, set_avtar] = useState(item.avtar);

  // console.log(item);

  return (
    <>
      {status === false ? (
        msg === "This is Private Account." ? (
          (alert(`${msg}`), router.back())
        ) : (
          router.push("/logIn")
        )
      ) : (
        <>
          {/* Profil Page Header Part Start */}
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
              <span className={style.name_info}>
                <p className={style.name}>{item.username}</p>
              </span>
            </div>
            <div className={style.right_cover}>
              <span className={style.opt}>
                <CiMenuKebab className={style.icons} />
              </span>
            </div>
          </section>
          {/* Profil Page Header Part Start */}

          {/* Profil Page Body Part Start */}
          <section className={style.body}>
            <div className={style.upper_section}>
              {item.status === "blocked by him" ||
              item.status === "blocked by you" ? null : (
                <>
                  <div className={style.upper_cover}>
                    <span className={style.pic_cover}>
                      {/*  */}

                      {avtar === "image" ? (
                        <span className={style.pic}>
                          <FaUserCircle className={style.icons} />
                        </span>
                      ) : (
                        <a href={avtar} target="_blank">
                          <span
                            className={style.pic}
                            style={{
                              backgroundImage: `url(
                                 ${avtar}
                                )`,
                            }}
                          ></span>
                        </a>
                      )}
                      {/*  */}

                      {item.status === "self" ? (
                        avtar === "image" ? (
                          <label htmlFor="profilePic" className={style.editBtn}>
                            <input
                              type="file"
                              name="profilePic"
                              id="profilePic"
                              accept="image/*"
                              hidden
                              onChange={(e) => {
                                postAvtar(
                                  e,
                                  item.userId,
                                  "Update Avtar",
                                  set_avtar,
                                  mutate
                                );
                              }}
                            />
                            <CiEdit className={style.icons} />
                          </label>
                        ) : (
                          <label
                            className={style.removeBtn}
                            onClick={() => {
                              removeAvtar(
                                "Delete Avtar",
                                mutate,
                                set_avtar,
                                avtar
                              );
                            }}
                          >
                            <MdDeleteForever className={style.icons} />
                          </label>
                        )
                      ) : null}

                      {/*  */}
                    </span>

                    <span className={style.nameInfo_cover}>
                      <p className={style.name}>{item.name}</p>
                      <p className={style.live_status}>
                        ({item.onlineStatus ? "online" : "offline"})
                      </p>
                    </span>
                  </div>
                  <div className={style.lower_cover}>
                    <span className={style.friStatus_cover}>
                      <span>
                        <p>{item.follower}</p>
                        <p>Followers</p>
                      </span>
                      <span>
                        <p>{item.following}</p>
                        <p>Following</p>
                      </span>
                    </span>
                  </div>
                </>
              )}
            </div>

            <div className={style.lower_section}>
              {item.status === "blocked by him" ||
              item.status === "blocked by you" ? null : (
                <>
                  <span className={style.about_cover}>
                    <strong>
                      About
                      {item.status === "self" ? (
                        <button
                          className={style.aboutEditBtn}
                          onClick={() => {
                            set_showPopUP({
                              logOutSection: 0,
                              aboutSection: 1,
                            });
                          }}
                        >
                          <FaRegEdit className={style.icons} />
                        </button>
                      ) : null}
                    </strong>
                    <p>{item.about}</p>
                  </span>

                  {item.status === "self" ? (
                    <span className={style.mainInfo_cover}>
                      <strong>Account Info.</strong>
                      <p>
                        {` Gmail-Id        :      ${
                          item.email.split("@")[0]
                        } \n Password      :      *********`}
                      </p>
                    </span>
                  ) : null}

                  <span className={style.QrCode_cover}>
                    <strong>QR Code</strong>
                    <strong
                      onClick={() => {
                        alert("This feature is temporary unavailable");
                      }}
                    >
                      <BsQrCodeScan className={style.icons} />
                    </strong>
                  </span>
                </>
              )}
              {item.status === "Unknown" ? null : (
                <span className={style.logOutBtn_cover}>
                  {item.status === "self" ? (
                    <>
                      <strong>LogOut</strong>
                      <button
                        onClick={() =>
                          set_showPopUP({
                            logOutSection: 1,
                            aboutSection: 0,
                          })
                        }
                      >
                        <BiLogOut className={style.icons} />
                        LogOut
                      </button>
                    </>
                  ) : item.status === "blocked by you" ? (
                    <>
                      <strong>Unblock the Account</strong>
                      <button
                        onClick={() => {
                          putRequest("Unblock User", item.userId, mutate);
                        }}
                      >
                        <BiBlock className={style.icons} /> Unblock
                      </button>
                    </>
                  ) : (
                    <>
                      <strong>Block & Report</strong>
                      <button
                        onClick={() => {
                          putRequest("Block User", item.userId, mutate);
                        }}
                      >
                        <BiBlock className={style.icons} /> Block
                      </button>
                      <button
                        onClick={() => {
                          putRequest("Block User", item.userId, mutate);
                        }}
                      >
                        <BsShieldExclamation className={style.icons} />
                        Report
                      </button>
                    </>
                  )}
                </span>
              )}
            </div>
          </section>
          {/* Profil Page Body Part Start */}
        </>
      )}
    </>
  );
};

export default ProfileComponent;
