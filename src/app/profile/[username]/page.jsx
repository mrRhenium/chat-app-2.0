"use client";

import style from "../../../styles/ProfilePage.module.css";

import { BsArrowLeft } from "react-icons/bs";
import { CiMenuKebab } from "react-icons/ci";
import { FaUserCircle } from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";
import { BsQrCodeScan } from "react-icons/bs";
import { BiBlock } from "react-icons/bi";
import { BsShieldExclamation } from "react-icons/bs";
import { useRouter } from "next/navigation";

const ProfilePage = () => {
  const router = useRouter();

  return (
    <>
      <div className={style.profile_page}>
        <div className={style.container}>
          {/*  */}

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
                <p className={style.name}>Savita Didi</p>
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
              <div className={style.upper_cover}>
                <span className={style.pic_cover}>
                  <span className={style.pic}>
                    <FaUserCircle className={style.icons} />
                  </span>
                </span>
                <span className={style.nameInfo_cover}>
                  <p className={style.name}>Savita Didi</p>
                  <p className={style.live_status}>(online)</p>
                </span>
                <span className={style.btn_cover}>
                  <button>Edit Profile</button>
                </span>
              </div>
              <div className={style.lower_cover}>
                <span className={style.friStatus_cover}>
                  <span>
                    <p>5.7K</p>
                    <p>Followers</p>
                  </span>
                  <span>
                    <p>984</p>
                    <p>Following</p>
                  </span>
                </span>
              </div>
            </div>
            <div className={style.lower_section}>
              <span className={style.about_cover}>
                <strong>About</strong>
                <p>
                  Hi!! There, This is Savita Yadav. Always thinks about the
                  future and Be Futuristic is my priority.
                </p>
              </span>

              <span className={style.mainInfo_cover}>
                <strong>Account Info.</strong>
                {/* <p>
                  {` Name            :      Savita Yadav \n Username    :      savi01 \n Gmail-Id       :      mr.rhenium75614 \n Password      :      *********`}
                </p> */}

                <p>
                  {` Gmail-Id       :      mr.rhenium75614 \n Password      :      *********`}
                </p>
              </span>

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

              <span className={style.logOutBtn_cover}>
                <strong>LogOut</strong>
                <button>
                  <BiLogOut className={style.icons} />
                  LogOut
                </button>

                {/* <strong>Bocked & Report</strong>
                <button>
                  <BiBlock className={style.icons} /> Blocked
                </button>
                <button>
                  <BsShieldExclamation className={style.icons} /> Report
                </button> */}
              </span>
            </div>
          </section>
          {/* Profil Page Body Part Start */}

          {/*  */}
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
