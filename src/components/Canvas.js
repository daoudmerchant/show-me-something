import { useContext } from "react";
import { useHistory } from "react-router";
import { RedditPostContext } from "../constants/contexts";
import { useMediaQuery } from "react-responsive";

import "../styles/Canvas.css";

// constants
import { WELCOME, FINISHED } from "../constants/sitetext";

// components
import Info from "./Info";
import Prompt from "./Prompt";
import Post from "./Post";
import Loading from "./Loading";

const Canvas = ({ welcomed, showContent }) => {
  const { fetchingPosts, getNextPost, thisListFinished, currentPost } =
    useContext(RedditPostContext);
  const history = useHistory();

  console.log(currentPost);
  // media query
  const isTouchscreen = useMediaQuery({ query: "(hover: none)" });
  return (
    <div id="canvas">
      {(() => {
        if (fetchingPosts) return <Loading type="POSTS" />;
        if (currentPost === null) {
          // failed
          return (
            <Prompt
              type="RedditError"
              cancel={() => history.push("/settings")}
              confirm={getNextPost}
            />
          );
        }
        if (!welcomed)
          return <Info text={WELCOME(isTouchscreen ? "tap" : "click")} />;
        if (thisListFinished) return <Info text={FINISHED} />;
        if (currentPost === undefined)
          return (
            <div>{`${isTouchscreen ? "Tap" : "Click"} below to begin 👇`}</div>
          );
        return <Post showContent={showContent} />;
      })()}
    </div>
  );
};

export default Canvas;
