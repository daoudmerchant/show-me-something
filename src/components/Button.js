import { useContext } from "react";
import { RedditPostContext } from "../contexts";

// @ts-ignore
const Button = ({ button }) => {
  const { getNextPost } = useContext(RedditPostContext);
  console.log(button.subreddits);
  return (
    <button
      onClick={() => {
        getNextPost(button.subreddits);
      }}
    >
      {button.text}
    </button>
  );
};

export default Button;
