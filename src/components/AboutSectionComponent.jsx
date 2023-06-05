"use client";

import { useState } from "react";
import style from "../styles/AboutSectionComponent.module.css";

const AboutSectionComponent = ({ closePopUp, about, mutate }) => {
  const [aboutText, set_aboutText] = useState(about);

  const updateAbout = async (e) => {
    e.preventDefault();

    if (about === aboutText) return;

    if (aboutText.length > 200 || aboutText.length < 10) {
      alert("About Section limit is 10-100 characters.");
      return;
    }

    const JSONdata = JSON.stringify({
      action: "Update About",
      about: aboutText,
    });

    const res = await fetch(`/api/profile/SelfUser`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSONdata,
    });

    const resData = await res.json();
    if (resData.status === false) alert(`${resData.msg}`);

    mutate();
    closePopUp();

    //
  };

  return (
    <>
      {/* Header Section Start hear */}
      <section className={style.header}>
        <strong>Edit About</strong>
      </section>
      {/* Header Section End hear */}

      {/* Body Section Start hear */}
      <section className={style.body}>
        <form onSubmit={updateAbout}>
          <label>
            <textarea
              name="aboutSection"
              id="aboutSection"
              cols="25"
              rows="10"
              placeholder="Edit your about..."
              value={aboutText}
              onChange={(e) => set_aboutText(e.target.value)}
            ></textarea>
          </label>
          <label className={style.btnCover}>
            <button onClick={() => closePopUp()}>Cancel</button>
            <button type="sumit">Save</button>
          </label>
        </form>
      </section>
      {/* Body Section End hear */}
    </>
  );
};

export default AboutSectionComponent;
