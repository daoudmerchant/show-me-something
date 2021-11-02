// styles
import "../styles/Loading.css";

// components
import Snoo from "./Snoo";

const Loading = ({ type }) => {
  const loadingData = (() => {
    // limited types, no fall-through needed
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
      case "COMMENTS":
        return {
          text: "Fetching comments",
          className: "gettingcomments",
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
