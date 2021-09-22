import { useContext } from "react";
import { RedditPostContext } from "../contexts";

// @ts-ignore
const Button = ({ button }) => {
  const { getNextPost, finishedList } = useContext(RedditPostContext);
  return (
    <button
      disabled={finishedList === button.text}
      style={button.style}
      onClick={() => {
        getNextPost({ subreddits: button.subreddits, category: button.text });
      }}
    >
      {button.text}
    </button>
  );
};

export default Button;
