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
import { stringArraysAreIdentical, shuffleArray } from "./utils";

function App() {
  const [buttons, setButtons] = useState(null);
  const [fetchingPosts, setFetchingPosts] = useState(false);
  const [fetchingButtons, setFetchingButtons] = useState(false);
  const [welcomed, setWelcomed] = useState(false);
  const [currentSubreddits, setCurrentSubreddits] = useState(null);
  const [currentPost, setCurrentPost] = useState(null);
  const [currentRedditList, setCurrentRedditList] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const incrementIndex = useCallback(() => {
    setCurrentIndex((prevIndex) => prevIndex + 1);
  }, []);

  const getNextPost = useCallback(
    async (subreddits) => {
      const refreshRedditList = async (subreddits) => {
        const getRedditPost = async (subreddit) => {
          const redditResponse = await getRedditData({ subreddit });
          return redditResponse;
        };
        if (!welcomed) setWelcomed(true);
        setCurrentSubreddits(subreddits);
        setCurrentIndex(0);
        let subredditLists = [];
        for (let i = 0; i < subreddits.length; i++) {
          const subredditList = await getRedditPost(subreddits[i]);
          subredditLists = [...subredditLists, ...subredditList];
        }
        const randomisedSubredditLists = shuffleArray(subredditLists);
        setCurrentRedditList(randomisedSubredditLists);
      };
      if (
        !currentSubreddits ||
        !stringArraysAreIdentical(subreddits, currentSubreddits)
      ) {
        setFetchingPosts(true);
        await refreshRedditList(subreddits);
        setFetchingPosts(false);
      } else {
        incrementIndex();
      }
    },
    [currentSubreddits, currentIndex]
  );

  useEffect(() => {
    if (!!currentRedditList) {
      setCurrentPost(currentRedditList[currentIndex]);
    }
  }, [currentRedditList, currentIndex]);

  // context values
  const noMorePosts =
    currentRedditList && currentIndex === currentRedditList.length;
  const RedditContextValue = {
    getNextPost,
    currentPost,
    fetchingPosts,
    noMorePosts,
  };

  const getButtons = useCallback(async () => {
    let isSubscribed = true;
    setFetchingButtons(true);
    const defaultButtons = await getDefaultButtons();
    if (isSubscribed) setButtons(defaultButtons);
    setFetchingButtons(false);
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
          <Canvas
            welcomed={welcomed}
            fetchingPosts={fetchingPosts}
            noMorePosts={noMorePosts}
          />
        </Router>
        <ButtonBox fetchingButtons={fetchingButtons} buttons={buttons} />
      </RedditPostContext.Provider>
    </main>
  );
}

export default App;
