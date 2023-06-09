"use client";

import settingStyle from "../../../../styles/SettingLayout.module.css";
import style from "../../../../styles/Help.module.css";

import { BsArrowLeft } from "react-icons/bs";
import { useRouter } from "next/navigation";

const Help = () => {
  const router = useRouter();
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
                <strong className={settingStyle.name}>Help</strong>
              </span>
            </div>
          </section>
          {/* Theme Page : Header End Here */}

          {/* Theme Page : Body Start Here */}
          <section className={settingStyle.body}>
            <div className={settingStyle.cover}>
              <h1>Help</h1>
            </div>
          </section>
          {/* Theme Page : Body Start Here */}

          {/*  */}
        </div>
      </div>
    </>
  );
};

export default Help;
