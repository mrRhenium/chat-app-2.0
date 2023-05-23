import style from "../styles/ProfilePage.module.css";

import { BsArrowLeft } from "react-icons/bs";
import { BsQrCodeScan } from "react-icons/bs";
import { BsShieldExclamation } from "react-icons/bs";
import { FaUserCircle } from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";
import { BiBlock } from "react-icons/bi";
import { CiMenuKebab } from "react-icons/ci";

import { useRouter } from "next/navigation";

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

  alert(`${resData.msg}`);

  //
};

const ProfileComponent = ({ item, set_showPopUP, msg, status }) => {
  const router = useRouter();
  console.log(item);

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
                      <span className={style.pic}>
                        <FaUserCircle className={style.icons} />
                      </span>
                    </span>
                    <span className={style.nameInfo_cover}>
                      <p className={style.name}>{item.name}</p>
                      <p className={style.live_status}>
                        ({item.onlineStatus ? "online" : "offline"})
                      </p>
                    </span>
                    <span className={style.btn_cover}>
                      {item.status === "self" ? (
                        <button>Edit Profile</button>
                      ) : null}
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
                    <strong>About</strong>
                    <p>{item.about}</p>
                  </span>

                  {item.status === "self" ? (
                    <span className={style.mainInfo_cover}>
                      <strong>Account Info.</strong>
                      <p>
                        {` Gmail-Id       :      ${item.email} \n Password      :      *********`}
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
