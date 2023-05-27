import style from "../styles/Notification.module.css";
import { FaUserCircle } from "react-icons/fa";

import { useRouter } from "next/navigation";
import { MdOutlineDeleteOutline } from "react-icons/md";
//
//

const putRequest = async (action, targetUserId, mutate) => {
  //

  let time = new Date().toLocaleString("en-US", {
    hour12: true,
    hour: "2-digit",
    minute: "2-digit",
  });

  const JSONdata = JSON.stringify({
    action: action,
    targetUserId: targetUserId,
    time: time,
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

const NotifyItemComponent = ({ list, option, mutate }) => {
  const router = useRouter();
  return (
    <>
      {list.map((item) => {
        return (
          <div key={item.userId} className={style.notify_items}>
            <span className={style.itemPic_cover}>
              <span
                className={style.item_pic}
                onClick={() => {
                  router.push(`/profile/${item.username}`);
                }}
              >
                <FaUserCircle className={style.icons} />
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
            {option === "Send" ? (
              item.active ? (
                <span className={style.itemBtn_cover}>
                  <strong className={style.readOnly}>Pending..</strong>
                  <button
                    className={style.reject_btn}
                    onClick={() => {
                      putRequest(
                        "Send-Invitation Cancelled",
                        item.userId,
                        mutate
                      );
                    }}
                  >
                    Cancel
                  </button>
                </span>
              ) : (
                <span className={style.itemBtn_cover}>
                  <strong className={style.readOnly}>Rejected</strong>
                  <button
                    className={style.reject_btn}
                    onClick={() => {
                      putRequest(
                        "Rejected-Invitation Deleted",
                        item.userId,
                        mutate
                      );
                    }}
                  >
                    <MdOutlineDeleteOutline />
                  </button>
                </span>
              )
            ) : item.active ? (
              <span className={style.itemBtn_cover}>
                <button
                  className={style.accept_btn}
                  onClick={() => {
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
                    putRequest(
                      "Recieved-Invitation Rejected",
                      item.userId,
                      mutate
                    );
                  }}
                >
                  Cancel
                </button>
              </span>
            ) : (
              <span className={style.itemBtn_cover}>
                <strong className={style.readOnly}>Cancelled</strong>
                <button
                  className={style.reject_btn}
                  onClick={() => {
                    putRequest(
                      "Cancel-Invitation Deleted",
                      item.userId,
                      mutate
                    );
                  }}
                >
                  <MdOutlineDeleteOutline />
                </button>
              </span>
            )}
          </div>
        );
      })}
    </>
  );
};

export default NotifyItemComponent;
