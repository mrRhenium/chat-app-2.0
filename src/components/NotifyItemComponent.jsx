import style from "../styles/Notification.module.css";
import { FaUserCircle } from "react-icons/fa";

import { useRouter } from "next/navigation";
import { MdOutlineDeleteOutline } from "react-icons/md";
//
//

const putRequest = async (action, targetUserId) => {
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

  alert(`${resData.msg}`);

  //
};

const NotifyItemComponent = ({ list, option, mutate }) => {
  const router = useRouter();
  return (
    <>
      {list.map((item) => {
        return (
          <div
            key={item.userId}
            className={style.notify_items}
            onClick={() => mutate()}
          >
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
                      putRequest("Send-Invitation Cancelled", item.userId);
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
                      putRequest("Rejected-Invitation Deleted", item.userId);
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
                    putRequest("Recieved-Invitation Accepted", item.userId);
                  }}
                >
                  Confirm
                </button>
                <button
                  className={style.reject_btn}
                  onClick={() => {
                    putRequest("Recieved-Invitation Rejected", item.userId);
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
                    putRequest("Cancel-Invitation Deleted", item.userId);
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
