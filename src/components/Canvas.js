import { useContext } from "react";
import { RedditPostContext } from "../contexts";

// components
import Post from "./Post";
import Loading from "./Loading";

const Canvas = ({ welcomed }) => {
  const { fetchingPosts, finishedList, currentPost } =
    useContext(RedditPostContext);
  return (
    <div id="canvas">
      {(() => {
        if (!welcomed) return <div>Welcome!</div>;
        if (fetchingPosts) return <Loading type="POSTS" />;
        if (!!finishedList) return <div>Finished!</div>;
        if (!currentPost) return <div>Click below to begin</div>;
        return <Post />;
      })()}
    </div>
  );
};

export default Canvas;
