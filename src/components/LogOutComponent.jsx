"use client";

import style from "../styles/LogOutComponent.module.css";

import { useRouter } from "next/navigation";
import { BiLogOut } from "react-icons/bi";

const LogOutComponent = ({ closePopUp }) => {
  const router = useRouter();

  const logOut = async (e) => {
    //

    e.preventDefault();

    const res = await fetch(`/api/logIn`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const resData = await res.json();
    if (resData.status === false) alert(`${resData.msg}`);

    if (resData.status) {
      document.cookie = "token=;Path=/;Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
      router.push("/logIn");
    }
    //
  };

  return (
    <>
      {/* Header Section Start hear */}
      <section className={style.header}>
        <header>
          <span>
            <BiLogOut className={style.icons} />
          </span>
        </header>
      </section>
      {/* Header Section End hear */}

      {/* Body Section Start hear */}
      <section className={style.body}>
        <span>
          <strong>Do you want to LogOut? </strong>
        </span>
        <form onSubmit={logOut}>
          <span>
            <button onClick={() => closePopUp()}>Cancel</button>
            <button type="submit">Confirm</button>
          </span>
        </form>
      </section>
      {/* Body Section End hear */}
    </>
  );
};

export default LogOutComponent;
