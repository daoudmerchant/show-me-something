import { useContext } from "react";

import "../styles/Prompt.css";

// context
import { RedditPostContext } from "../constants/contexts";

const Bold = ({ children }) => <span className="bold">{children}</span>;
const Important = ({ children }) => (
  <span className="important">{children}</span>
);

const Prompt = ({ type, confirm, cancel }) => {
  const { getNextPost, currentPost } = useContext(RedditPostContext);

  const flagWarning = [
    'This post has been marked with a "',
    <Bold>{type}</Bold>,
    '" tag.',
  ];
  const content = {
    spoiler: {
      emoji: "🤫",
      header: "Shhhhhh...",
      help: {
        question: ["What is a ", <Bold>Spoiler</Bold>, "?"],
        answer: [
          "A ",
          <Bold>Spoiler</Bold>,
          "is content which may reveal details about a piece of media which could 'spoil' the surprise",
        ],
      },
      confirmation: "I don't mind, I want to see!",
    },
    NSFW: {
      emoji: "😳",
      header: "Oh my...",
      help: {
        question: ["What does ", <Bold>NSFW</Bold>, " stand for?"],
        answer: [
          <Bold>NSFW</Bold>,
          " stands for ",
          <Bold>N</Bold>,
          "ot ",
          <Bold>S</Bold>,
          "afe ",
          <Bold>F</Bold>,
          "or ",
          <Bold>W</Bold>,
          "ork, meaning ",
          <Important>
            content not suitable for people under the age of 18
          </Important>,
          ". This may include ",
          <Bold>graphic violence</Bold>,
          ", ",
          <Bold>drug usage</Bold>,
          ", ",
          <Bold>sexual content</Bold>,
          ".",
        ],
      },
      confirmation: "I confirm that I am over 18 years old",
    },
    RedditError: {
      emoji: "😓",
      header: "Oh no!",
      body: "Reddit isn't responding!",
      help: {
        question: "Have you checked that:",
        answer: (
          <ul>
            <li>Your internet is connected and working</li>
            <li>
              <a href="https://www.redditstatus.com/">Reddit is not down</a>
            </li>
            <li>
              Both the{" "}
              <a
                href={`https://www.reddit.com/r/${currentPost.subreddit}/`}
                target="_blank"
                rel="noreferrer"
              >
                subreddit
              </a>{" "}
              and{" "}
              <a href={currentPost.url} target="_blank" rel="noreferrer">
                post
              </a>{" "}
              are accessible?
            </li>
          </ul>
        ),
      },
      confirmation: "Retry loading content",
      cancellation: "Edit settings",
    },
  };

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
        <h1>{content[type].emoji}</h1>
        <h2>{content[type].header}</h2>
        <p>{content[type].body || flagWarning}</p>
        <div className="promptbuttons">
          <button
            type="button"
            className="cancel"
            onClick={stopPropagation(cancel || getNextPost)}
          >
            {content[type].cancellation || "Skip this post"}
          </button>
          <button type="submit" className="submit" onClick={stopPropagation()}>
            {content[type].confirmation}
          </button>
        </div>
        <aside>
          <h3>{content[type].help.question}</h3>
          <p>{content[type].help.answer}</p>
        </aside>
      </form>
    </div>
  );
};

export default Prompt;
