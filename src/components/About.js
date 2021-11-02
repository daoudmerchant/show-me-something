import { Link } from "react-router-dom";

// styles
import "../styles/About.css";

// constants
import { ABOUT } from "../constants/sitetext";

// components
import Info from "./Info";

const About = () => {
  return (
    <>
      <p>
        Click <Link to="/">here</Link> to head back
      </p>
      <div id="aboutcontainer">
        <Info text={ABOUT} />
      </div>
    </>
  );
};

export default About;
