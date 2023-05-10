"use client";
import style from "../styles/LogInFormComponent.module.css";

import { FcGoogle } from "react-icons/fc";
import { AiOutlineUser } from "react-icons/ai";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

import { useState } from "react";
import { useRouter } from "next/navigation";

const LogInFormComponent = () => {
  const router = useRouter();
  const [passwordIcon, set_passwordIcon] = useState(1);

  const submitForm = async (e) => {
    e.preventDefault();

    let final_username = username.value.trim();
    let final_password = password.value.trim();

    try {
      //

      const Formdata = {
        username: final_username,
        password: final_password,
      };

      // Send the data to the server in JSON format.
      const JSONdata = JSON.stringify(Formdata);

      const result = await fetch("/api/logIn", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSONdata,
      });

      const data = await result.json();
      console.log("Successful", data);

      if (data.status === false) {
        alert(data.msg);
        //
      } else if (data.status === true) {
        document.cookie = `token=${data.token};expire;max-age=86400`;
        router.push("/user/chats");
        //
      }

      // console.log(result);

      //
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={style.form}>
      {/* LogIn page Form Part Start */}
      <form onSubmit={submitForm}>
        <label className={style.input_cover}>
          <input
            type="text"
            name="username"
            id="username"
            autoComplete="off"
            placeholder="Username"
            required
          />
          <AiOutlineUser className={style.input_icons} />
        </label>
        <label className={style.input_cover}>
          <input
            type={passwordIcon ? "password" : "text"}
            name="password"
            id="password"
            autoComplete="off"
            placeholder="Password"
            required
          />
          {passwordIcon ? (
            <FaRegEyeSlash
              className={style.input_icons}
              onClick={() => {
                set_passwordIcon(!passwordIcon);
              }}
            />
          ) : (
            <FaRegEye
              className={style.input_icons}
              onClick={() => {
                set_passwordIcon(!passwordIcon);
              }}
            />
          )}
        </label>
        <label className={style.input_cover}>
          <button type="submit" className={style.signIn_page_btn}>
            Log In
          </button>
        </label>
      </form>
      {/* Sign In page Form Part End */}

      {/* Sign In page Divider Part Start */}
      <span className={style.divider}>
        <span className={style.bar}></span>
        <span>OR</span>
        <span className={style.bar}></span>
      </span>
      {/* Sign In page Divider Part End*/}

      {/* Sign In page Google Sign In Part Start */}
      <div className={style.google_signIn_cover}>
        <button
          onClick={() => {
            alert("This feature is temporary Unavailable");
          }}
        >
          <FcGoogle className={style.google_signIn_icon} />
          Continue with Google
        </button>
      </div>
      {/* Sign In page Google Sign In Part End */}
    </div>
  );
};
export default LogInFormComponent;
