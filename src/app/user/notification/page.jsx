import style from "../../../styles/Notification.module.css";

import { FaUserCircle } from "react-icons/fa";

const Notification = () => {
  return (
    <>
      <section className={style.header}>
        <h1>Notification</h1>
      </section>
      <section className={style.body}>
        <div className={style.notifyItem_cover}>
          <div className={style.notify_items}>
            <span className={style.itemPic_cover}>
              <span className={style.item_pic}>
                <FaUserCircle className={style.icons} />
              </span>
            </span>
            <span className={style.itemName_cover}>
              <span className={style.username_cover}>
                <p>savita</p>
              </span>
              <span className={style.fullname_cover}>
                <p>Savita Yadav</p>
              </span>
            </span>
            <span className={style.itemBtn_cover}>
              <button className={style.accept_btn}>Confirm</button>
              <button className={style.reject_btn}>Delete</button>
            </span>
          </div>
        </div>
      </section>
    </>
  );
};

export default Notification;
