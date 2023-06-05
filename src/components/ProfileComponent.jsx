import style from "../styles/ProfilePage.module.css";

import { FaUserCircle, FaRegEdit } from "react-icons/fa";
import { BiLogOut, BiBlock } from "react-icons/bi";
import { CiMenuKebab, CiEdit } from "react-icons/ci";
import { MdDeleteForever } from "react-icons/md";
import { BsShieldExclamation, BsArrowLeft, BsQrCodeScan } from "react-icons/bs";

import { useRouter } from "next/navigation";
// import { useState } from "react";
// import Image from "next/image";

//
//

const putRequest = async (action, targetUserId) => {
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

  //
};

const removeAvtar = async (userId, action, mutate) => {
  //

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

  // Post Image and Avtar to Media Server

  const mediaRes = await fetch(
    `${process.env.NEXT_PUBLIC_MEDIAURL}/media/profile?userId=${userId}`,
    {
      method: "DELETE",
    }
  );

  const mediaResData = await mediaRes.json();
  if (mediaResData.status === false) alert(`${mediaResData.msg}`);

  console.log("Profile Image is deleted");
  mutate();
  //
};

const postAvtar = async (e, userId, action, mutate) => {
  //

  let imgName = e.target.files[0].name.split(" ").join("");

  const JSONdata = JSON.stringify({
    action: action,
    imgUrl: `/assets/${userId}/profile/${imgName}`,
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

  // Post Image and Avtar to Media Server
  const formData = new FormData();
  formData.append("userId", userId);
  formData.append("profilePic", e.target.files[0]);

  // console.log(e.target.files[0]);

  const mediaRes = await fetch(
    `${process.env.NEXT_PUBLIC_MEDIAURL}/media/profile`,
    {
      method: "POST",
      body: formData,
    }
  );

  const mediaResData = await mediaRes.json();
  if (mediaResData.status === false) alert(`${mediaResData.msg}`);

  console.log("Profile Image is updated.");
  mutate();

  //
};

const ProfileComponent = ({ item, set_showPopUP, msg, status, mutate }) => {
  const router = useRouter();

  // console.log(process.env.NEXT_PUBLIC_MEDIAURL + item.avtar);

  return (
    <>
      {status === false ? (
        (alert(`${msg}`), router.back())
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
                      <span
                        className={style.pic}
                        style={
                          item.avtar === `/assets/${item.userId}`
                            ? {}
                            : {
                                backgroundImage: `url(
                                  ${process.env.NEXT_PUBLIC_MEDIAURL}${item.avtar}
                                )`,
                              }
                        }
                      >
                        {item.avtar === `/assets/${item.userId}` ? (
                          <FaUserCircle className={style.icons} />
                        ) : null}
                      </span>

                      {/*  */}
                      {/* {item.status === "self" ? (
                        item.avtar === `/assets/${item.userId}` ? (
                          <label htmlFor="profilePic" className={style.editBtn}>
                            <input
                              type="file"
                              name="profilePic"
                              id="profilePic"
                              accept="image/*"
                              hidden
                              onChange={(e) =>
                                postAvtar(
                                  e,
                                  item.userId,
                                  "Update Avtar",
                                  mutate
                                )
                              }
                            />
                            <CiEdit className={style.icons} />
                          </label>
                        ) : (
                          <label
                            className={style.removeBtn}
                            onClick={() =>
                              removeAvtar(item.userId, "Delete Avtar", mutate)
                            }
                          >
                            <MdDeleteForever className={style.icons} />
                          </label>
                        )
                      ) : null} */}

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
                      <button>
                        <FaRegEdit className={style.icons} />
                      </button>
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

              <span className={style.logOutBtn_cover}>
                {item.status === "self" ? (
                  <>
                    <strong>LogOut</strong>
                    <button onClick={() => set_showPopUP(1)}>
                      <BiLogOut className={style.icons} />
                      LogOut
                    </button>
                  </>
                ) : item.status === "blocked by you" ? (
                  <>
                    <strong>Bocked & Report</strong>
                    <button
                      onClick={() => {
                        putRequest("Unblock User", item.userId);
                      }}
                    >
                      <BiBlock className={style.icons} /> Unblock
                    </button>
                  </>
                ) : (
                  <>
                    <strong>Bocked & Report</strong>
                    <button
                      onClick={() => {
                        putRequest("Block User", item.userId);
                      }}
                    >
                      <BiBlock className={style.icons} /> Block
                    </button>
                    <button
                      onClick={() => {
                        putRequest("Block User", item.userId);
                      }}
                    >
                      <BsShieldExclamation className={style.icons} />
                      Report
                    </button>
                  </>
                )}
              </span>
            </div>
          </section>
          {/* Profil Page Body Part Start */}
        </>
      )}
    </>
  );
};

export default ProfileComponent;
