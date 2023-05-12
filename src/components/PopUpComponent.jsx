import style from "../styles/PopUpComponent.module.css";

const PopUpComponent = ({ children, closePopUp }) => {
  return (
    <>
      <div className={style.popUp_comp}>
        <div className={style.container} onClick={() => closePopUp()}></div>
        <div className={style.popUp_cover}>{children}</div>
      </div>
    </>
  );
};

export default PopUpComponent;
