"use client";

import style from "../styles/LogOutComponent.module.css";
import { FaPowerOff } from "react-icons/fa";

const DeleteAcComponent = ({ closePopUp }) => {
  return (
    <>
      {/* Header Section Start hear */}
      <section className={style.header}>
        <header>
          <span>
            <FaPowerOff className={style.icons} />
          </span>
        </header>
      </section>
      {/* Header Section End hear */}

      {/* Body Section Start hear */}
      <section className={style.body}>
        <span className={style.warnMsg}>
          <strong>Are you sure ?</strong>
          <strong>Parmanent delete your account</strong>
          <strong>This is ir-reversible process. </strong>
        </span>
        <form className={style.btn_cover}>
          <span>
            <label>
              <input
                type="text"
                name="reason"
                id="reason"
                placeholder="Enter the reason..."
                autoComplete="off"
                required
              />
            </label>
          </span>
          <span>
            <button onClick={() => closePopUp()}>Cancel</button>
            <button
              type="sumit"
              onClick={() => {
                console.log("Submit");
              }}
            >
              Confirm
            </button>
          </span>
        </form>
      </section>
      {/* Body Section End hear */}
    </>
  );
};

export default DeleteAcComponent;
