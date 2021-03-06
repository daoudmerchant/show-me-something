import { useContext } from "react";

// styles
import "../styles/Prompt.min.css";

// constants
import { PROMPT } from "../constants/sitetext";

// context
import { RedditPostContext } from "../constants/contexts";

const Prompt = ({ type, confirm, cancel }) => {
  // context
  const { getNextPost } = useContext(RedditPostContext);

  // text
  const promptText = PROMPT[type];

  const stopPropagation = (cb) => {
    return (e) => {
      e.stopPropagation();
      cb?.();
    };
  };

  return (
    <div id="promptcontainer">
      <form
        id="prompt"
        onSubmit={(e) => {
          e.preventDefault();
          confirm();
        }}
      >
        <h1>{promptText.emoji}</h1>
        <h2>{promptText.header}</h2>
        <p>{promptText.body}</p>
        <div className="promptbuttons">
          <button
            type="button"
            className="cancel"
            onClick={stopPropagation(cancel || getNextPost)}
          >
            {promptText.cancellation || "Skip this post"}
          </button>
          <button type="submit" className="submit" onClick={stopPropagation()}>
            {promptText.confirmation}
          </button>
        </div>
        <aside>
          <h3>{promptText.help.question}</h3>
          <p>{promptText.help.answer}</p>
        </aside>
      </form>
    </div>
  );
};

export default Prompt;
