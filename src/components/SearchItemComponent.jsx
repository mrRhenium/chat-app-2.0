import style from "../styles/Search.module.css";
import { useRouter } from "next/navigation";
import { FaUserCircle } from "react-icons/fa";
import { CgCloseO } from "react-icons/cg";

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

  const res = await fetch(`/api/search`, {
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

const SearchItemComponent = ({ list, mutate }) => {
  const router = useRouter();

  return (
    <>
      {list.map((item) => {
        return (
          <div key={item.userId} className={style.search_items}>
            <span className={style.itemPic_cover}>
              <span
                className={style.item_pic}
                onClick={() => {
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
                {item.avtar === "image" ? (
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
            <span className={style.itemBtn_cover}>
              {item.invitation == "none" ? (
                item.friend ? (
                  <>
                    <span>
                      <button
                        onClick={() => {
                          router.push(`/user/chats/${item.username}`);
                        }}
                      >
                        Open
                      </button>
                    </span>
                  </>
                ) : (
                  <>
                    <span>
                      <button
                        onClick={() => {
                          item.invitation = "Send";
                          putRequest("Invite User", `${item.userId}`, mutate);
                        }}
                      >
                        Invite
                      </button>
                    </span>
                  </>
                )
              ) : item.invitation == "Send" ? (
                <>
                  <span>
                    <strong className={style.readOnly}>Pending..</strong>
                  </span>
                  <span>
                    <button
                      className={style.secondBtn}
                      onClick={() => {
                        item.invitation = "none";
                        putRequest(
                          "Send-Invitation Cancelled",
                          `${item.userId}`,
                          mutate
                        );
                      }}
                    >
                      <CgCloseO className={style.icons} />
                    </button>
                  </span>
                </>
              ) : (
                <>
                  <span>
                    <button
                      onClick={() => {
                        item.invitation = "none";
                        item.friend = 1;
                        putRequest(
                          "Recieved-Invitation Accepted",
                          `${item.userId}`,
                          mutate
                        );
                      }}
                    >
                      Confirm
                    </button>
                  </span>
                  <span>
                    <button
                      className={style.secondBtn}
                      onClick={() => {
                        item.invitation = "none";
                        putRequest(
                          "Recieved-Invitation Rejected",
                          `${item.userId}`,
                          mutate
                        );
                      }}
                    >
                      <CgCloseO className={style.icons} />
                    </button>
                  </span>
                </>
              )}
            </span>
          </div>
        );
      })}
    </>
  );
};

export default SearchItemComponent;
