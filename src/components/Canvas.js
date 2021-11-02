import { useContext } from "react";
import { useHistory } from "react-router";
import { useMediaQuery } from "react-responsive";

// styles
import "../styles/Canvas.min.css";

// constants
import { WELCOME, FINISHED } from "../constants/sitetext";

// context
import { RedditPostContext } from "../constants/contexts";

// components
import Info from "./Info";
import Prompt from "./Prompt";
import Post from "./Post";
import Loading from "./Loading";

const Canvas = ({ welcomed, showContent }) => {
  // context
  const { fetchingPosts, getNextPost, thisListFinished, currentPost } =
    useContext(RedditPostContext);

  // history
  const history = useHistory();

  // media query
  const isTouchscreen = useMediaQuery({ query: "(hover: none)" });

  return (
    <div id="canvas">
      {(() => {
        // loading
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
        if (thisListFinished) return <Info text={FINISHED} />;
        if (!welcomed) {
          const selectEvent = isTouchscreen ? "tap" : "click";
          const WELCOME_TEXT = WELCOME(selectEvent);
          return <Info text={WELCOME_TEXT} />;
        }
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
