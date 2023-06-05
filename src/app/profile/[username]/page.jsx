"use client";

import style from "../../../styles/ProfilePage.module.css";
import PopUpComponent from "@/components/PopUpComponent";
import LogOutComponent from "@/components/LogOutComponent";
import LoadingComponent from "@/components/LoadingComponent";
import ProfileComponent from "@/components/ProfileComponent";
import AboutSectionComponent from "@/components/AboutSectionComponent";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import useSWR from "swr";

//
//

const URL = `/api/profile`;
const fetcher = async (url) => {
  const res = await fetch(url);
  const data = await res.json();
  return data;
};

//
const ProfilePage = () => {
  useEffect(() => {
    let theme = localStorage.getItem("theme") || "light";

    theme === "light"
      ? document.body.classList.remove("darkTheme")
      : document.body.classList.add("darkTheme");
  }, []);

  let uName = useParams().username;

  const [showPopUP, set_showPopUP] = useState({
    logOutSection: 0,
    aboutSection: 0,
  });

  const { data, isLoading, mutate } = useSWR(`${URL}/${uName}`, fetcher);

  const closePopUp = () =>
    set_showPopUP({
      logOutSection: 0,
      aboutSection: 0,
    });

  return (
    <>
      {showPopUP.logOutSection || showPopUP.aboutSection ? (
        <PopUpComponent closePopUp={closePopUp}>
          {showPopUP.logOutSection ? (
            <LogOutComponent closePopUp={closePopUp} />
          ) : null}
          {showPopUP.aboutSection ? (
            <AboutSectionComponent
              closePopUp={closePopUp}
              about={data ? data["data"].about : ""}
              mutate={mutate}
            />
          ) : null}
        </PopUpComponent>
      ) : null}

      <div className={style.profile_page}>
        <div className={style.container}>
          {isLoading ? (
            <LoadingComponent />
          ) : (
            <ProfileComponent
              item={data ? data["data"] : {}}
              msg={data["msg"]}
              status={data["status"]}
              set_showPopUP={set_showPopUP}
              mutate={mutate}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
