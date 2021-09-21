import { useContext } from "react";
import { RedditPostContext } from "../contexts";

// @ts-ignore
const Button = ({ button }) => {
  const getResponse = useContext(RedditPostContext);
  return (
    <button
      onClick={() => {
        // @ts-ignore
        button.subreddits.forEach((subreddit) => {
          getResponse(subreddit);
        });
      }}
    >
      {button.text}
    </button>
  );
};

export default Button;
