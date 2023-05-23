"use client";

import style from "../../../styles/Notification.module.css";
import LoadingComponent from "@/components/LoadingComponent";
import NotifyItemComponent from "@/components/NotifyItemComponent";

import useSWR from "swr";
import { useState } from "react";

const URL = "http://localhost:3000/api/notification";
const fetcher = async (url) => {
  const res = await fetch(url);
  const data = await res.json();
  return data;
};

const Notification = () => {
  const [option, set_option] = useState("Send");
  const { data, isLoading, mutate } = useSWR(URL, fetcher);

  return (
    <>
      <section className={style.header}>
        <h1>Notification</h1>
      </section>
      <section className={style.body}>
        <div className={style.nav_cover}>
          <span
            className={option === "Send" ? style.active : ""}
            onClick={() => {
              set_option("Send");
            }}
          >
            <strong>SEND REQ.</strong>
          </span>
          <span
            className={option === "Recieved" ? style.active : ""}
            onClick={() => {
              set_option("Recieved");
            }}
          >
            <strong>RECIEVED REQ.</strong>
          </span>
        </div>
        <div className={style.notifyItem_cover}>
          {isLoading ? (
            <LoadingComponent />
          ) : (
            <NotifyItemComponent
              list={
                option === "Send" ? data["data"].send : data["data"].recieved
              }
              option={option}
              mutate={mutate}
            />
          )}
        </div>
      </section>
    </>
  );
};

export default Notification;
