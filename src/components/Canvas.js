import { useContext } from "react";
import { RedditPostContext } from "../constants/contexts";
import { useMediaQuery } from "react-responsive";

import "../styles/Canvas.css";

// constants
import { WELCOME, FINISHED } from "../constants/sitetext";

// components
import Info from "./Info";
import Post from "./Post";
import Loading from "./Loading";

const Canvas = ({ welcomed, showContent }) => {
  const { fetchingPosts, thisListFinished, currentPost } =
    useContext(RedditPostContext);
  // media query
  const isTouchscreen = useMediaQuery({ query: "(hover: none)" });
  return (
    <div id="canvas">
      {(() => {
        if (!welcomed)
          return <Info text={WELCOME(isTouchscreen ? "tap" : "click")} />;
        if (fetchingPosts) return <Loading type="POSTS" />;
        if (thisListFinished) return <Info text={FINISHED} />;
        if (!currentPost)
          return (
            <div>{`${isTouchscreen ? "Tap" : "Click"} below to begin 👇`}</div>
          );
        return <Post showContent={showContent} />;
      })()}
    </div>
  );
};

export default Canvas;
