"use client";

import style from "../styles/LogOutComponent.module.css";
import { BiLogOut } from "react-icons/bi";

const LogOutComponent = ({ closePopUp }) => {
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
        <form>
          <span>
            <button onClick={() => closePopUp()}>Cancel</button>
            <button>Confirm</button>
          </span>
        </form>
      </section>
      {/* Body Section End hear */}
    </>
  );
};

export default LogOutComponent;
