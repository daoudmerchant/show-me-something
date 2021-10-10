import { useContext } from "react";
import { RedditPostContext } from "../contexts";

// components
import Post from "./Post";
import Snoo from "./Snoo";

const Canvas = ({ welcomed }) => {
  const { fetchingPosts, finishedList, currentPost } =
    useContext(RedditPostContext);
  return (
    <div id="canvas">
      {(() => {
        if (!welcomed) return <div>Welcome!</div>;
        if (fetchingPosts)
          return (
            <div className="loading posts">
              <p>Fetching p</p>
              <Snoo spinning={true} />
              <p>sts</p>
            </div>
          );
        if (!!finishedList) return <div>Finished!</div>;
        if (!currentPost) return <div>Click below to begin</div>;
        return <Post />;
      })()}
    </div>
  );
};

export default Canvas;
