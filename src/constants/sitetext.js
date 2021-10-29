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
