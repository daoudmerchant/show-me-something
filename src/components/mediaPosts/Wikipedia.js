import { useContext } from "react";
import { RedditPostContext } from "../../constants/contexts";

const Wikipedia = () => {
  const { currentPost } = useContext(RedditPostContext);

  return (
    <iframe title={currentPost.title} src={currentPost.media.content.url} />
  );
};

export default Wikipedia;
