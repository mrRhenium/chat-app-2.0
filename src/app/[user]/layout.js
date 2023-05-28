"use client";

import style from "../../styles/UserLayout.module.css";

import { FaHome } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import { AiFillSetting } from "react-icons/ai";
import { BsDot } from "react-icons/bs";
import { VscBellDot } from "react-icons/vsc";
import { MdNotifications } from "react-icons/md";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import useSWR from "swr";

const URL = `/api/users`;
const fetcher = async (url) => {
  const res = await fetch(url);
  const data = await res.json();
  return data;
};

const putMethod = async (action) => {
  console.log(action);

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

  //
};

const UserLayout = ({ children }) => {
  const [menuIndex, set_menuIndex] = useState(0);
  const pathname = usePathname();

  const { data } = useSWR(URL, fetcher, {
    refreshInterval: 30000,
  });

  // console.log(data);

  let notifyCount = 0;
  if (data && data["status"]) {
    notifyCount = data["user"].notifications.count;
  }

  // data && data["status"] === false
  //   ? console.log(`${data["msg"]}`)
  //   : console.log("Alright " + data["user"].notifications.count);

  useEffect(() => {
    let theme = localStorage.getItem("theme") || "light";

    theme === "light"
      ? document.body.classList.remove("darkTheme")
      : document.body.classList.add("darkTheme");

    //

    if (document.readyState === "complete") putMethod("User is online");
    window.addEventListener("beforeunload", () => putMethod("User is offline"));

    // CleanUp function
    return () => {
      window.removeEventListener("beforeunload", () =>
        putMethod("User is offline")
      );
    };

    //
  }, []);

  if (
    pathname === "/user/chats" ||
    pathname === "/user/notification" ||
    pathname === "/user/search" ||
    pathname === "/user/setting"
  ) {
    //

    return (
      <>
        <div className={style.chats_page}>
          <div className={style.container}>
            {/*  */}

            {children}

            {/* Chats page Footer Part Starts */}
            <section className={style.footer}>
              <nav className={style.menu_bar}>
                <ul>
                  <li>
                    <Link href={`/user/chats`} onClick={() => set_menuIndex(0)}>
                      <BsDot className={style.iconBadge} />

                      <FaHome
                        className={
                          menuIndex === 0
                            ? `${style["icons"]} ${style["active"]}`
                            : `${style["icons"]}`
                        }
                      />
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={`/user/search`}
                      onClick={() => set_menuIndex(1)}
                    >
                      <FaSearch
                        className={
                          menuIndex === 1
                            ? `${style["icons"]} ${style["active"]}`
                            : `${style["icons"]}`
                        }
                      />
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={`/user/notification`}
                      onClick={() => set_menuIndex(2)}
                    >
                      <BsDot className={style.iconBadge} />

                      {notifyCount != 0 ? (
                        <VscBellDot
                          className={
                            menuIndex === 2
                              ? `${style["icons"]} ${style["active"]}`
                              : `${style["icons"]}`
                          }
                        />
                      ) : (
                        <MdNotifications
                          className={
                            menuIndex === 2
                              ? `${style["icons"]} ${style["active"]}`
                              : `${style["icons"]}`
                          }
                        />
                      )}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={`/user/setting`}
                      onClick={() => set_menuIndex(3)}
                    >
                      <AiFillSetting
                        className={
                          menuIndex === 3
                            ? `${style["icons"]} ${style["active"]}`
                            : `${style["icons"]}`
                        }
                      />
                    </Link>
                  </li>
                </ul>
              </nav>
            </section>
            {/* Chats page Footer Part Ends*/}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className={style.chats_page}>
        <div className={style.container}>{children}</div>
      </div>
    </>
  );
};

export default UserLayout;
