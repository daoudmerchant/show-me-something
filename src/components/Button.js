import { useContext } from "react";
import { RedditPostContext } from "../contexts";

// @ts-ignore
const Button = ({ button }) => {
  const { getNextPost, noMorePosts } = useContext(RedditPostContext);
  return (
    <button
      onClick={() => {
        if (!noMorePosts) getNextPost(button.subreddits);
      }}
    >
      {button.text}
    </button>
  );
};

export default Button;
