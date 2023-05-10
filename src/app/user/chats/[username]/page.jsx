"use client";

import style from "../../../../styles/ChattingPage.module.css";

import { BsArrowLeft } from "react-icons/bs";
import { BiUser } from "react-icons/bi";
import { CiMenuKebab } from "react-icons/ci";
import { MdSend } from "react-icons/md";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const ChattingPage = () => {
  const chatsCover = useRef();
  const router = useRouter();

  useEffect(() => {
    chatsCover.current.scrollTop = chatsCover.current.scrollHeight;
  }, []);

  return (
    <>
      <div className={style.chattingPage}>
        <div className={style.container}>
          {/* Header Part Start */}
          <section className={style.header}>
            <div className={style.left_cover}>
              <span
                className={style.back_btn}
                onClick={() => {
                  router.back();
                }}
              >
                <BsArrowLeft className={style.icons} />
              </span>
              <span
                className={style.pic_info}
                onClick={() => {
                  router.push("/profile/nit");
                }}
              >
                <BiUser className={style.icons} />
              </span>
              <span className={style.name_info}>
                <p className={style.name}>Savita Didi</p>
                <p className={style.live_status}>(online)</p>
              </span>
            </div>
            <div className={style.right_cover}>
              <span className={style.opt}>
                <CiMenuKebab className={style.icons} />
              </span>
            </div>
          </section>
          {/* Header Part Ends */}

          {/* Body Part Starts */}
          <section className={style.body}>
            <div className={style.chats_cover} ref={chatsCover}>
              <span className={style.msg_left}>
                <p>
                  I will be go thgggggggggggggggggggere soon. You there is a
                  tiger who looks at me.
                </p>
                <p className={style.msg_time}>2:25 PM</p>
              </span>
              <span className={style.msg_right}>
                <p>Where are you Didi ?</p>
                <p className={style.msg_time}>02:25 PM</p>
              </span>

              {/* demo */}
              <span className={style.msg_left}>
                <p>I will be go there soon.</p>
                <p className={style.msg_time}>2:25 PM</p>
              </span>
              <span className={style.msg_left}>
                <p>I will be go there soon.</p>
                <p className={style.msg_time}>2:25 PM</p>
              </span>

              <span className={style.msg_right}>
                <p>Where are you Didi? There is not at all for me.</p>
                <p className={style.msg_time}>02:25 PM</p>
              </span>
              <span className={style.msg_right}>
                <p>Where are you Didi ?</p>
                <p className={style.msg_time}>02:25 PM</p>
              </span>

              <span className={style.msg_left}>
                <p>I will be go there soon.</p>
                <p className={style.msg_time}>2:25 PM</p>
              </span>
              <span className={style.msg_right}>
                <p>Where are you Didi ?</p>
                <p className={style.msg_time}>02:25 PM</p>
              </span>

              <span className={style.msg_left}>
                <p>I will be go there soon.</p>
                <p className={style.msg_time}>2:25 PM</p>
              </span>
              <span className={style.msg_right}>
                <p>Where are you Didi ?</p>
                <p className={style.msg_time}>02:25 PM</p>
              </span>

              {/* demo */}
            </div>
          </section>
          {/* Body Part Ends */}

          {/* Footer Part Starts */}
          <section className={style.footer}>
            <form action="">
              <label className={style.input_cover}>
                <input
                  type="text"
                  name="msg"
                  id={style.msg_input}
                  placeholder="Message..."
                  autoComplete="off"
                />
              </label>
              <label className={style.sendBtn_cover}>
                <button type="submit">
                  <MdSend className={style.icons} />
                </button>
              </label>
            </form>
          </section>
          {/* Footer Part Ends */}
        </div>
      </div>
    </>
  );
};

export default ChattingPage;
