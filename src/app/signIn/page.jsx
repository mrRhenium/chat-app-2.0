import style from "../../styles/SignIn.module.css";
import SignInFormComponent from "@/components/SignInFormComponent";
import img from "../../../public/LOGO (2).png";

import Link from "next/link";
import Image from "next/image";

const SignIn = () => {
  return (
    <>
      <div className={style.signIn_page}>
        <div className={style.container}>
          {/*  */}

          {/* Sign In page Header Part Starts */}
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
            <h1 className={style.heading}>Sign In</h1>
          </section>
          {/* Sign In page Header Part Starts */}

          {/* Sign In page Body Part Starts */}
          <section className={style.body}>
            <SignInFormComponent />
            {/* Sign In page Footer Part Start */}
            <div className={style.footer}>
              <span>
                Already have an Account? <Link href={`/logIn`}>Log In</Link>
              </span>
            </div>
            {/* Sign In page Footer Part Ends */}
          </section>
          {/* Sign In page Body Part End */}

          {/*  */}
        </div>
      </div>
    </>
  );
};

export default SignIn;
