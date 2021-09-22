import { useContext } from "react";
import { RedditPostContext } from "../contexts";

const Post = () => {
  const { currentPost } = useContext(RedditPostContext);
  if (!currentPost) return <div>Welcome Message</div>;
  return (
    <div>
      <p>{currentPost.title}</p>
    </div>
  );
};

export default Post;
