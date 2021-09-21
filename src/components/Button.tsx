import { useContext } from "react";
import { RedditPostContext } from "../contexts";

// @ts-ignore
const Button = ({ button }) => {
  const getResponse = useContext(RedditPostContext);
  return (
    <button onClick={() => getResponse(button.subreddits)}>
      {button.text}
    </button>
  );
};

export default Button;
