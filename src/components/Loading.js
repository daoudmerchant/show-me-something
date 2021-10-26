import Snoo from "./Snoo";

import "../styles/Loading.css";

const Loading = ({ type }) => {
  const loadingData = (() => {
    /* eslint-disable */
    switch (type) {
      case "POSTS":
        return {
          text: ["Fetching p", "sts..."],
          className: "gettingposts",
        };
      case "BUTTONS":
        return {
          text: ["Fetching butt", "ns..."],
          className: "gettingbuttons",
        };
      case "VIDEO":
        return {
          text: ["L", "ading video..."],
          className: "gettingposts",
        };
      case "IMAGE":
        return {
          text: ["L", "ading image..."],
          className: "gettingposts",
        };
    }
  })();
  return (
    <div className="loadingcontainer">
      <div className={`loading ${loadingData.className}`}>
        <p>{loadingData.text[0]}</p>
        <Snoo spinning={true} />
        <p>{loadingData.text[1]}</p>
      </div>
    </div>
  );
};

export default Loading;
