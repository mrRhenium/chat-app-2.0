"use client";

import style from "../styles/SignInFormComponent.module.css";

import { FcGoogle } from "react-icons/fc";
import { AiOutlineUser, AiOutlineMail } from "react-icons/ai";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { RiErrorWarningLine } from "react-icons/ri";

import { useState } from "react";
import { useRouter } from "next/navigation";

const SignInFormComponent = () => {
  const router = useRouter();
  // console.log("hello", window.location.host);

  const [passwordIcon, set_passwordIcon] = useState(1);
  const [MSG, set_MSG] = useState({
    fullnameMSG: "",
    usernameMSG: "",
    emailMSG: "",
    passwordMSG: "",
    confirm_passwordMSG: "",
  });

  const fullnameChangeHandler = () => {
    let final_fullname = fullname.value.trim();

    if (
      (final_fullname.length > 3 && final_fullname.length < 20) ||
      final_fullname.length === 0
    ) {
      set_MSG((pre) => ({
        ...pre,
        fullnameMSG: "",
      }));
    } //
    else {
      set_MSG((pre) => ({
        ...pre,
        fullnameMSG: "name should be contain 4-20 characters!",
      }));
    }
  };

  let checkUsernameExistance;
  const usernameChangeHandler = async () => {
    //
    clearTimeout(checkUsernameExistance);
    let final_username = username.value.trim();

    //
    checkUsernameExistance = setTimeout(async () => {
      const result = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: final_username }),
      });

      const data = await result.json();
      console.log(data);

      if (data.msg === "This user is not exist!") {
        set_MSG((pre) => ({
          ...pre,
          usernameMSG: final_username.includes(" ")
            ? "username do not contain any space"
            : "",
        }));
      } //
      else {
        set_MSG((pre) => ({
          ...pre,
          usernameMSG: "this username is arleady exist!",
        }));
      }
    }, 2000);
  };

  const emailChangeHandler = () => {
    const pattern = /^[\w.+\-]+@gmail\.com$/;
    let result = email.value.match(pattern);

    if (result || email.value === "") {
      set_MSG((pre) => ({
        ...pre,
        emailMSG: "",
      }));
    } //
    else {
      set_MSG((pre) => ({
        ...pre,
        emailMSG: "enter valid Gmail Id !",
      }));
    }
  };

  const passwordChangeHandler = () => {
    let final_password = password.value.trim();

    if (final_password.length >= 6 || final_password.length === 0) {
      set_MSG((pre) => ({
        ...pre,
        passwordMSG: "",
      }));
    } //
    else {
      set_MSG((pre) => ({
        ...pre,
        passwordMSG: "password should be contain >= 6 characters!",
      }));
    }
  };

  const confirm_passwordChangeHandler = () => {
    let final_password = password.value.trim();
    let final_confirm_password = confirm_password.value.trim();

    if (
      final_confirm_password === final_password ||
      confirm_password.value === ""
    ) {
      set_MSG((pre) => ({
        ...pre,
        confirm_passwordMSG: "",
      }));
    } //
    else {
      set_MSG((pre) => ({
        ...pre,
        confirm_passwordMSG: "password should be match !",
      }));
    }
  };

  const submitForm = async (e) => {
    e.preventDefault();

    let final_fullname = fullname.value.trim();
    let final_username = username.value.trim();
    let final_email = email.value.trim();
    let final_password = password.value.trim();

    if (MSG.fullnameMSG != "") {
      alert("Enter valid name!");
      return;
    } //
    else if (MSG.usernameMSG != "") {
      alert("Enter valid username!");
      return;
    } //
    else if (MSG.emailMSG != "") {
      alert("Enter valid G-mail ID!");
      return;
    } //
    else if (MSG.passwordMSG != "") {
      alert("Enter valid password!");
    } //
    else if (MSG.confirm_passwordMSG != "") {
      alert("Passwords are not matching!");
      return;
    }

    try {
      //

      const Formdata = {
        name: final_fullname,
        username: final_username,
        email: final_email,
        password: final_password,
      };

      // Send the data to the server in JSON format.
      const JSONdata = JSON.stringify(Formdata);

      const result = await fetch("/api/signIn", {
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
        router.push("/logIn");
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
      {/* Sign In page Form Part Start */}
      <form onSubmit={submitForm}>
        <label className={style.input_cover}>
          <input
            type="text"
            name="fullname"
            id="fullname"
            autoComplete="off"
            placeholder="Name"
            required
            onChange={() => fullnameChangeHandler()}
          />
          {MSG.fullnameMSG === "" ? (
            <AiOutlineUser className={style.input_icons} />
          ) : (
            <RiErrorWarningLine
              className={`${style["input_icons"]} ${style["input_error_icons"]}`}
            />
          )}
        </label>
        {MSG.fullnameMSG === "" ? null : <strong>{MSG.fullnameMSG}</strong>}

        <label className={style.input_cover}>
          <input
            type="text"
            name="username"
            id="username"
            autoComplete="off"
            placeholder="Username"
            required
            onChange={() => usernameChangeHandler()}
          />
          {MSG.usernameMSG === "" ? (
            <AiOutlineUser className={style.input_icons} />
          ) : (
            <RiErrorWarningLine
              className={`${style["input_icons"]} ${style["input_error_icons"]}`}
            />
          )}
        </label>
        {MSG.usernameMSG === "" ? null : <strong>{MSG.usernameMSG}</strong>}

        <label className={style.input_cover}>
          <input
            type="email"
            name="email"
            id="email"
            autoComplete="off"
            placeholder="Email address"
            required
            onChange={() => emailChangeHandler()}
          />
          {MSG.emailMSG === "" ? (
            <AiOutlineMail className={style.input_icons} />
          ) : (
            <RiErrorWarningLine
              className={`${style["input_icons"]} ${style["input_error_icons"]}`}
            />
          )}
        </label>
        {MSG.emailMSG === "" ? null : <strong>{MSG.emailMSG}</strong>}

        <label className={style.input_cover}>
          <input
            type={passwordIcon ? "password" : "text"}
            name="password"
            id="password"
            autoComplete="off"
            placeholder="Password"
            required
            onChange={() => {
              passwordChangeHandler();
              confirm_passwordChangeHandler();
            }}
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
        {MSG.passwordMSG === "" ? null : <strong>{MSG.passwordMSG}</strong>}

        <label className={style.input_cover}>
          <input
            type={passwordIcon ? "password" : "text"}
            name="confirm_password"
            id="confirm_password"
            autoComplete="off"
            placeholder="Confirm password"
            required
            onChange={() => confirm_passwordChangeHandler()}
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
        {MSG.confirm_passwordMSG === "" ? null : (
          <strong>{MSG.confirm_passwordMSG}</strong>
        )}

        <label className={style.input_cover}>
          <button type="submit" className={style.signIn_page_btn}>
            Sign In
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

export default SignInFormComponent;
