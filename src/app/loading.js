import LoadingComponent from "../components/LoadingComponent";
import style from "../styles/Loading.module.css";

const Loading = () => {
  return (
    <>
      <div className={style.loading_page}>
        <LoadingComponent />;
      </div>
    </>
  );
};

export default Loading;
