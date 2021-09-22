import { useEffect, useState, useCallback } from "react";
import { BrowserRouter as Router } from "react-router-dom";
// APIs
import { getRedditData, getCommentData } from "./API/reddit";
import { getDefaultButtons } from "./API/firebase/firebase";

// styles
import "./App.css";

// components
import NavBar from "./components/NavBar";
import Canvas from "./components/Canvas";
import ButtonBox from "./components/ButtonBox";

// contexts
import { RedditPostContext } from "./contexts";

// utils
import { stringArraysAreIdentical, shuffleArray } from "./utils";

function App() {
  // STATE
  const [buttons, setButtons] = useState(null);
  const [fetchingPosts, setFetchingPosts] = useState(false);
  const [welcomed, setWelcomed] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [currentSubreddits, setCurrentSubreddits] = useState(null);
  const [currentPost, setCurrentPost] = useState(null);
  const [currentRedditList, setCurrentRedditList] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Update State
  // - SYNC
  const incrementIndex = useCallback(() => {
    setCurrentIndex((prevIndex) => prevIndex + 1);
  }, []);

  // - ASYNC
  const getNextPost = useCallback(
    async ({ subreddits, category }) => {
      const refreshRedditList = async (subreddits) => {
        const getRedditPost = async (subreddit) => {
          const redditResponse = await getRedditData({ subreddit });
          return redditResponse;
        };
        if (!welcomed) setWelcomed(true);
        setCurrentCategory(category);
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

  const setDefaultButtons = useCallback(async () => {
    let isSubscribed = true;
    const defaultButtons = await getDefaultButtons();
    if (isSubscribed) setButtons(defaultButtons);
    return () => (isSubscribed = false);
  }, []);

  // Set default buttons on mount
  useEffect(() => {
    setDefaultButtons();
  }, []);

  // Update current post on index or list change
  useEffect(() => {
    if (!!currentRedditList) {
      setCurrentPost(currentRedditList[currentIndex]);
    }
  }, [currentRedditList, currentIndex]);

  // CONSTANTS
  const finishedList =
    currentRedditList && currentIndex === currentRedditList.length
      ? currentCategory
      : false;
  const RedditContextValue = {
    getNextPost,
    currentPost,
    fetchingPosts,
    finishedList,
  };

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
            finishedList={finishedList}
          />
        </Router>
        <ButtonBox buttons={buttons} />
      </RedditPostContext.Provider>
    </main>
  );
}

export default App;
