import { Link } from "react-router-dom";

import { ABOUT } from "../constants/sitetext";

import "../styles/About.css";

import Info from "./Info";

const About = () => {
  return (
    <>
      <p>
        Click{" "}
        <Link exact to="/">
          here
        </Link>{" "}
        to head back
      </p>
      <div id="aboutcontainer">
        <Info text={ABOUT} />
      </div>
    </>
  );
};

export default About;
