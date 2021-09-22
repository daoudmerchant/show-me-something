import { useEffect, useState, useCallback } from "react";

import { BrowserRouter as Router } from "react-router-dom";
import "./App.css";
import { getRedditData, getCommentData } from "./API/reddit";
import { getDefaultButtons } from "./API/firebase/firebase";

// components
import NavBar from "./components/NavBar";
import Canvas from "./components/Canvas";
import ButtonBox from "./components/ButtonBox";

// context
import { RedditPostContext } from "./contexts";

// utils
import { stringArraysAreIdentical } from "./utils";

function App() {
  const [buttons, setButtons] = useState(null);
  const [currentSubreddits, setCurrentSubreddits] = useState(null);
  const [currentPost, setCurrentPost] = useState(null);
  const [currentRedditList, setCurrentRedditList] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const incrementIndex = useCallback(() => {
    setCurrentIndex((prevIndex) => prevIndex + 1);
  }, []);

  const getNextPost = useCallback(
    async (subreddits) => {
      console.log("Getting post");
      const refreshRedditList = async (subreddits) => {
        const getRedditPost = async (subreddit) => {
          const redditResponse = await getRedditData({ subreddit });
          console.log(redditResponse);
          return redditResponse;
        };
        setCurrentPost(null);
        setCurrentSubreddits(subreddits);
        setCurrentIndex(0);
        let subredditLists = [];
        for (let i = 0; i < subreddits.length; i++) {
          const subredditList = await getRedditPost(subreddits[i]);
          subredditLists = [...subredditLists, ...subredditList];
        }
        setCurrentRedditList(subredditLists);
      };
      if (
        !currentSubreddits ||
        !stringArraysAreIdentical(subreddits, currentSubreddits)
      ) {
        await refreshRedditList(subreddits);
      }
      console.log(subreddits);
      console.log(currentSubreddits);
      incrementIndex();
    },
    [currentSubreddits]
  );

  useEffect(() => {
    if (!!currentRedditList) {
      console.log("Let's do this");
      console.log(currentRedditList[currentIndex]);
      setCurrentPost(currentRedditList[currentIndex]);
    }
  }, [currentIndex, currentRedditList, incrementIndex]);

  // context values
  const RedditContextValue = { getNextPost, currentPost };

  const getButtons = useCallback(async () => {
    let isSubscribed = true;
    const defaultButtons = await getDefaultButtons();
    console.log(defaultButtons);
    if (isSubscribed) setButtons(defaultButtons);
    return () => (isSubscribed = false);
  }, []);

  useEffect(() => {
    getButtons();
  }, []);

  /*
  
  REDDIT TEST

  const [response, setResponse] = useState(null);
  const [comments, setComments] = useState(null);
  const getResponse = useCallback(async () => {
    const redditResponse = await getRedditData();
    console.log(redditResponse);
    setResponse(redditResponse);
  }, []);
  const getComments = useCallback(async (url: string) => {
    let isSubscribed = true;
    const comments = await getCommentData(url);
    console.log(comments);
    // @ts-ignore
    if (isSubscribed) setComments(comments);
    return () => (isSubscribed = false);
  }, []);
  useEffect(() => {
    getResponse();
  }, [getResponse]);

  // TEST
  // set comments
  useEffect(() => {
    if (!!response && !comments) {
      // @ts-ignore
      const item = response[0].url;
      console.log(item);
      getComments(item);
    }
  }, [comments, getComments, response]);
  //

  */

  return (
    <main className="App">
      <RedditPostContext.Provider value={RedditContextValue}>
        <Router>
          <NavBar />
          <Canvas />
        </Router>
        {buttons && <ButtonBox buttons={buttons} />}
      </RedditPostContext.Provider>
    </main>
  );
}

export default App;
