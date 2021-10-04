import { useContext } from "react";
import { RedditPostContext } from "../contexts";
// import { Switch, Route } from "react-router-dom"
import Post from "./Post";
// import User from "./User";
// import Welcome from "./Welcome";

const Canvas = ({ welcomed }) => {
  const { fetchingPosts, finishedList, currentPost } =
    useContext(RedditPostContext);
  return (
    <div id="canvas">
      {(() => {
        if (!welcomed) return <div>Welcome!</div>;
        if (fetchingPosts) return <div>Fetching posts</div>;
        if (!!finishedList) return <div>Finished!</div>;
        if (!currentPost) return <div>Click below to begin</div>;
        return <Post />;
      })()}
    </div>
  );
};

export default Canvas;
