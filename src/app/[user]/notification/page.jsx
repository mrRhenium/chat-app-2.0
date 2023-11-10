"use client";

import style from "../../../styles/Notification.module.css";
import LoadingComponent from "@/components/LoadingComponent";
import NotifyItemComponent from "@/components/NotifyItemComponent";

import useSWR from "swr";
import { useState } from "react";
import { useRouter } from "next/navigation";

const URL = "/api/notification";
const fetcher = async (url) => {
  const res = await fetch(url);
  const data = await res.json();
  return data;
};

const Notification = () => {
  const router = useRouter();

  const { data, isLoading, mutate } = useSWR(URL, fetcher, {
    refreshInterval: 1000,
  });

  const [option, set_option] = useState(() => {
    if (data) {
      return data["data"].send.length >= data["data"].recieved.length
        ? "Send"
        : "Recieved";
    } //
    else {
      return "Recieved";
    }
  });

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
          ) : data["status"] === false ? (
            router.push("/logIn")
          ) : (
            <NotifyItemComponent
              list={
                option === "Send" ? data["data"].send : data["data"].recieved
              }
              option={option}
              mutate={mutate}
              notifyId={data["data"].notifyId}
            />
          )}
        </div>
      </section>
    </>
  );
};

export default Notification;
