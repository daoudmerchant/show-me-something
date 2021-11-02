import { Link } from "react-router-dom";

export const ABOUT = [
  {
    header: "Wait... What is this?",
    body: [
      <span className="question">Never heard of Reddit?</span>,
      <span className="question">
        Went on Reddit once but found it overwhelming?
      </span>,
      <span className="question">
        Love Reddit but hate having to dig to get to the content?
      </span>,
      <span className="question">
        Avid Redditor but waste hours every time you visit?
      </span>,
      "... Give this a try.",
      "Press a category button to see a piece of content. " +
        "One tap, one piece of content. No adverts, no " +
        "'browsing'; think of it like a Reddit Pez dispenser 🙂.",
      [
        "Head back ",
        <Link exact to="/">
          home
        </Link>,
        " to get started, and when you're ready, head to the ",
        <Link exact to="/settings">
          settings
        </Link>,
        " page to sign in, customise what Reddit content you see " +
          " and create your own buttons.",
      ],
    ],
  },
  {
    header: "What should I know before starting?",
    body: [
      "This app uses Google Firebase to store user data, and " +
        "currently requires a Google account to be customised.",
      [
        "Please note that this app ",
        <span className="bold">does not</span>,
        " block content, and ",
        <span className="bold">
          may contain material unsuitable for people under 18 years
        </span>,
        ".",
      ],
    ],
  },
];

export const WELCOME = (clickOrTap) => [
  {
    header: "New here?",
    body: [
      [
        "Check the ",
        <Link exact to="/about">
          about
        </Link>,
        " page, head straight to ",
        <Link exact to="/settings">
          settings
        </Link>,
        " to customise your experience or simply ",
        clickOrTap,
        " a button below to get started 👇",
      ],
    ],
  },
];

export const FINISHED = [
  {
    header: "Finished!",
    body: ["Looks like you finished this content."],
  },
  {
    header: "Er... How do I get more?",
    body: [
      [
        "Head to ",
        <Link exact to="/settings">
          settings
        </Link>,
        " to increase how many posts are pulled from Reddit.",
      ],
    ],
  },
];

// PROMPTS

// Helper functions
const Bold = ({ children }) => <span className="bold">{children}</span>;
const Important = ({ children }) => (
  <span className="important">{children}</span>
);
const flagWarning = (type) => [
  'This post has been marked with a "',
  <Bold>{type}</Bold>,
  '" tag.',
];

export const PROMPT = {
  spoiler: {
    emoji: "🤫",
    header: "Shhhhhh...",
    body: flagWarning("spoiler"),
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
    body: flagWarning("NSFW"),
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
            <a
              href="https://www.redditstatus.com/"
              target="_blank"
              rel="noreferrer"
            >
              Reddit is not down
            </a>
          </li>
          {/* <li>
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
          </li> */}
        </ul>
      ),
    },
    confirmation: "Retry loading content",
    cancellation: "Edit settings",
  },
  contentError: {
    emoji: "😓",
    header: "Oh no!",
    body: "This content failed to load!",
    help: {
      answer: "Have you checked that your internet connection is working?",
    },
    confirmation: "Retry loading content",
  },
};
