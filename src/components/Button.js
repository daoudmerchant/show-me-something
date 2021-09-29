import { useContext } from "react";
import { RedditPostContext } from "../contexts";

const Button = ({ button }) => {
  const { getNextPost, finishedList } = useContext(RedditPostContext);
  const style = {
    ...button.style,
    fontFamily: `'${button.style.font}', Verdana, sans-serif`,
  };
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
