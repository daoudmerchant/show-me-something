import Snoo from "./Snoo";

import "../styles/Loading.css";

const Loading = ({ type }) => {
  const loadingData = (() => {
    /* eslint-disable */
    switch (type) {
      case "POSTS":
        return {
          text: "Fetching posts",
          className: "gettingposts",
        };
      case "BUTTONS":
        return {
          text: "Getting buttons",
          className: "gettingbuttons",
        };
      case "VIDEO":
        return {
          text: "Loading video",
          className: "gettingposts",
        };
      case "IMAGE":
        return {
          text: "Loading image",
          className: "gettingposts",
        };
    }
  })();
  return (
    <div className="loadingcontainer">
      <div className={`loading ${loadingData.className}`}>
        <Snoo spinning={true} />
        <p>{`${loadingData.text}...`}</p>
      </div>
    </div>
  );
};

export default Loading;
