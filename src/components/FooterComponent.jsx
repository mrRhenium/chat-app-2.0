import style from "../styles/Footer.module.css";

import { BiCopyright } from "react-icons/bi";
import { SiNextdotjs } from "react-icons/si";

const Footer = () => {
  return (
    <>
      <section className={style.footer_cover}>
        <strong>
          Copyright <BiCopyright className={style.icons} /> by mr.rhenium 2023
        </strong>
        <strong>
          Build in Next-Js <SiNextdotjs className={style.icons} /> 13.3.1v
        </strong>
      </section>
    </>
  );
};

export default Footer;
