import Link from "next/link";
import style from "../styles/Home.module.css";
import Image from "next/image";
import img from "../../public/LOGO (2).png";

const Home = () => {
  return (
    <>
      <div className={style.home_page}>
        <div className={style.container}>
          <section className={style.header}>
            <span className={style.logo_cover}>
              <Image
                src={img}
                alt="Picture of the author"
                width={200}
                height={200}
                className={style.logo}
              />
            </span>
          </section>
          <section className={style.body}>
            <span className={style.msg_cover}>
              <h2>{`Welcome !! \n to \n FS_Chats \n world Fastest & Secure \n messaging Platform`}</h2>
            </span>
            <span className={style.btn_cover}>
              <Link href={`/signIn`} className={style.btn}>
                Sign In
              </Link>
              <Link href={`logIn`} className={style.btn}>
                Log In
              </Link>
            </span>
          </section>
        </div>
      </div>
    </>
  );
};
export default Home;
