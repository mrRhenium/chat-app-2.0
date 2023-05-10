import style from "../../../styles/Search.module.css";

import { BiSearchAlt2 } from "react-icons/bi";
import { FaUserCircle } from "react-icons/fa";

const Search = () => {
  return (
    <>
      <section className={style.header}>
        <form action="">
          <label htmlFor="searchInput">
            <BiSearchAlt2 className={style.icons} />
            <input
              type="search"
              name="searchInput"
              id="searchInput"
              placeholder="search..."
              autoComplete="off"
              autoFocus
            />
          </label>
        </form>
      </section>
      <section className={style.body}>
        <div className={style.searchItem_cover}>
          <div className={style.search_items}>
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
              <button>Invite</button>
            </span>
          </div>
        </div>
      </section>
    </>
  );
};

export default Search;
