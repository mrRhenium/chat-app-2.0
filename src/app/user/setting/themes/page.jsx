"use client";

import settingStyle from "../../../../styles/SettingLayout.module.css";
import style from "../../../../styles/Themes.module.css";
import { BsSun, BsMoon } from "react-icons/bs";

import { BsArrowLeft } from "react-icons/bs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Themes = () => {
  const router = useRouter();

  useEffect(() => {
    let theme = localStorage.getItem("theme") || "light";
    theme === "light" ? (themeBtn.checked = 0) : (themeBtn.checked = 1);
  }, []);

  const toggleBtn = () => {
    if (themeBtn.checked) {
      document.body.classList.add("darkTheme");
      localStorage.setItem("theme", "dark");
    } //
    else {
      localStorage.setItem("theme", "light");
      document.body.classList.remove("darkTheme");
    }

    // console.log("hello " + themeBtn.checked);
  };

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
                <strong className={settingStyle.name}>Themes</strong>
              </span>
            </div>
          </section>
          {/* Theme Page : Header End Here */}

          {/* Theme Page : Body Start Here */}
          <section className={settingStyle.body}>
            <div className={settingStyle.cover}>
              <span className={style.appTheme_cover}>
                <strong>Application theme</strong>

                <label htmlFor="themeBtn" onClick={() => toggleBtn()}>
                  <input
                    type="checkbox"
                    name="themeBtnName"
                    id="themeBtn"
                    className={style.checkBox}
                  />
                  <BsSun className={style.icons} />
                  <BsMoon className={style.icons} />
                  <span className={style.btn_ball}></span>
                </label>
              </span>
            </div>
          </section>
          {/* Theme Page : Body Start Here */}

          {/*  */}
        </div>
      </div>
    </>
  );
};

export default Themes;
