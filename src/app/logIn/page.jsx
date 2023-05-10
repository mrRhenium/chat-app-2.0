import style from "../../styles/LogIn.module.css";
import img from "../../../public/LOGO (2).png";
import LogInFormComponent from "@/components/LogInFormComponent";

import Link from "next/link";
import Image from "next/image";

const LogIn = () => {
  return (
    <>
      <div className={style.logIn_page}>
        <div className={style.container}>
          {/*  */}

          {/* LogIn page Header Part Start */}
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
            <main>
              <p>
                {`Welcome Back !! \n to \n World Fastest & Secure \n Messaging Platform`}
              </p>
            </main>
            <h1 className={style.heading}>Log In</h1>
          </section>
          {/* LogIn page Header Part End */}

          {/* LogIn page Body Part Start */}
          <section className={style.body}>
            <LogInFormComponent />
            {/* LogIn page Footer Part Start */}
            <div className={style.footer}>
              <span>
                Don't have an Account? <Link href={`/signIn`}>SignIn</Link>
              </span>
            </div>
          </section>
          {/* LogIn page Body Part End */}
        </div>
      </div>
    </>
  );
};

export default LogIn;
