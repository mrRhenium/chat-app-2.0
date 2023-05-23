import style from "../styles/Loading.module.css";

const LoadingComponent = () => {
  return (
    <>
      <div className={style.container}>
        <div className={style.lds_hourglass}></div>
      </div>
    </>
  );
};

export default LoadingComponent;
