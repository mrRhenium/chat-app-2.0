"use client";

import settingStyle from "@/styles/SettingLayout.module.css";
import style from "@/styles/Privacy.module.css";
// import LoadingComponent from "@/components/LoadingComponent";

import { BsArrowLeft } from "react-icons/bs";

import { useRouter } from "next/navigation";
import useSWR from "swr";
import { useEffect } from "react";

const fetcher = async (url) => {
  const res = await fetch(url);
  const data = await res.json();
  return data;
};

const Privacy = () => {
  const router = useRouter();

  const { data, isLoading, mutate } = useSWR("/api/users", fetcher);
  let privateAccount = data && data["private"];

  useEffect(() => {
    const privacyBtn = document.querySelector("#privacyBtn");
    if (data) {
      privacyBtn.checked = privateAccount ? true : false;
    }
  });

  const toggleBtn = async (action) => {
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
    if (resData.status === false) alert(`${resData.msg}`);

    console.log("toggle Btn");
    mutate();
    //
  };

  console.log(privateAccount);

  return (
    <>
      <div className={settingStyle.settingLayout_page}>
        <div className={settingStyle.container}>
          {/*  */}

          {/* Theme Page : Header Start Here */}
          <section className={settingStyle.header}>
            <div className={settingStyle.header_cover}>
              <span
                className={settingStyle.back_btn}
                onClick={() => {
                  router.back();
                }}
              >
                <BsArrowLeft className={settingStyle.icons} />
              </span>

              <span className={settingStyle.name_info}>
                <strong className={settingStyle.name}>Privacy</strong>
              </span>
            </div>
          </section>
          {/* Theme Page : Header End Here */}

          {/* Theme Page : Body Start Here */}
          <section className={settingStyle.body}>
            <div className={settingStyle.cover}>
              {/*  */}

              <span className={style.privacyBtn_cover}>
                <span className={style.upper_cover}>
                  <strong>Private account</strong>
                  <label
                    htmlFor="privacyBtn"
                    onClick={() => toggleBtn("Toggle private account")}
                  >
                    <input
                      type="checkbox"
                      name="privacyBtnName"
                      id="privacyBtn"
                      className={style.checkBox}
                    />
                    <span className={style.btn_ball}></span>
                  </label>
                </span>
                <span className={style.lower_cover}>
                  <span className={style.message}>
                    <p>
                      When your account is public, your profile and posts can be
                      seen by anyone, on or off FS_Chats, even if they don't
                      have an FS_Chats account.
                    </p>
                    <p>
                      When your account is private only the followers you
                      approve can see what you share including your photos or
                      video on hashtag and location pages, and your followers
                      and following list.
                    </p>
                  </span>
                </span>
              </span>

              {/*  */}
            </div>
          </section>
          {/* Theme Page : Body Start Here */}

          {/*  */}
        </div>
      </div>
    </>
  );
};

export default Privacy;
