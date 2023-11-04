import style from "../styles/Notification.module.css";

import { MdOutlineDeleteOutline } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";
import { CgCloseO } from "react-icons/cg";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
//
//

const putRequest = async (action, targetUserId, mutate) => {
  //

  const JSONdata = JSON.stringify({
    action: action,
    targetUserId: targetUserId,
  });

  const res = await fetch(`/api/notification`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSONdata,
  });

  const resData = await res.json();
  if (resData.status === false) alert(`${resData.msg}`);
  mutate();

  //
};
const updateAvtar = async (action, targetUserId, notifyId, option) => {
  //

  const JSONdata = JSON.stringify({
    action: action,
    targetUserId: targetUserId,
    notifyId: notifyId,
    notifySection: option,
  });

  const res = await fetch(`/api/profile/targetUser`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSONdata,
  });

  const resData = await res.json();
  if (resData.status === false) alert(`${resData.msg}`);

  // console.log(resData.msg);
  // mutate();
  //
};

const NotifyItemComponent = ({ list, option, mutate, notifyId }) => {
  const router = useRouter();
  const [changeId, set_changeId] = useState([]);

  useEffect(() => {
    set_changeId([]);
  }, [list]);

  return (
    <>
      {list.map((item) => {
        return (
          <div key={item.userId} className={style.notify_items}>
            <span className={style.itemPic_cover}>
              <span
                className={style.item_pic}
                onClick={() => {
                  updateAvtar(
                    "Update Avtar in notify",
                    item.userId,
                    notifyId,
                    option
                  );
                  router.push(`/profile/${item.username}`);
                }}
                style={
                  item.avtar === "image"
                    ? {}
                    : {
                        backgroundImage: `url(${item.avtar})`,
                      }
                }
              >
                {item.avtar === "image" || !item.avtar ? (
                  <FaUserCircle className={style.icons} />
                ) : null}
              </span>
            </span>
            <span className={style.itemName_cover}>
              <span className={style.username_cover}>
                <p>{item.username}</p>
              </span>
              <span className={style.fullname_cover}>
                <p>{item.name}</p>
              </span>
            </span>
            <span className={style.info_cover}>
              <strong>{`${item.date} - ${item.time}`}</strong>
            </span>
            <span className={style.itemBtn_cover}>
              {changeId.includes(item.userId) ? (
                <strong className={style.readOnly}>Loading...</strong>
              ) : option === "Send" ? (
                item.active ? (
                  <>
                    <strong className={style.readOnly}>Pending..</strong>
                    <button
                      className={style.reject_btn}
                      onClick={() => {
                        set_changeId((prev) => [...prev, item.userId]);

                        putRequest(
                          "Send-Invitation Cancelled",
                          item.userId,
                          mutate
                        );
                      }}
                    >
                      <CgCloseO className={style.icons} />
                    </button>
                  </>
                ) : (
                  <>
                    <strong className={style.readOnly}>Rejected</strong>
                    <button
                      className={style.reject_btn}
                      onClick={() => {
                        set_changeId((prev) => [...prev, item.userId]);

                        putRequest(
                          "Rejected-Invitation Deleted",
                          item.userId,
                          mutate
                        );
                      }}
                    >
                      <MdOutlineDeleteOutline className={style.icons} />
                    </button>
                  </>
                )
              ) : item.active ? (
                <>
                  <button
                    className={style.accept_btn}
                    onClick={() => {
                      set_changeId((prev) => [...prev, item.userId]);

                      putRequest(
                        "Recieved-Invitation Accepted",
                        item.userId,
                        mutate
                      );
                    }}
                  >
                    Confirm
                  </button>
                  <button
                    className={style.reject_btn}
                    onClick={() => {
                      set_changeId((prev) => [...prev, item.userId]);

                      putRequest(
                        "Recieved-Invitation Rejected",
                        item.userId,
                        mutate
                      );
                    }}
                  >
                    <CgCloseO className={style.icons} />
                  </button>
                </>
              ) : (
                <>
                  <strong className={style.readOnly}>Cancelled</strong>
                  <button
                    className={style.reject_btn}
                    onClick={() => {
                      set_changeId((prev) => [...prev, item.userId]);

                      putRequest(
                        "Cancel-Invitation Deleted",
                        item.userId,
                        mutate
                      );
                    }}
                  >
                    <MdOutlineDeleteOutline className={style.icons} />
                  </button>
                </>
              )}
            </span>
          </div>
        );
      })}
    </>
  );
};

export default NotifyItemComponent;
