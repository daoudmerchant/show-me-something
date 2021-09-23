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
import { shuffleArray } from "./utils";

function App() {
  // STATE
  const [buttons, setButtons] = useState(null);
  const [fetchingPosts, setFetchingPosts] = useState(false);
  const [welcomed, setWelcomed] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [redditLists, setRedditLists] = useState(null);

  const categoryExists = useCallback(
    (category = currentCategory) =>
      !!currentCategory && !!redditLists && !!redditLists[category],
    [currentCategory, redditLists]
  );

  // Update State
  // - SYNC
  const incrementIndex = useCallback(() => {
    setRedditLists((prevLists) => {
      return {
        ...prevLists,
        [currentCategory]: {
          ...prevLists[currentCategory],
          index: prevLists[currentCategory].index + 1,
        },
      };
    });
  }, [currentCategory]);

  // - ASYNC
  const getNextPost = useCallback(
    async ({ subreddits, category }) => {
      const refreshRedditList = async (subreddits, category) => {
        const getSubredditList = async (subreddit) => {
          const redditResponse = await getRedditData({ subreddit });
          return redditResponse;
        };
        if (!welcomed) setWelcomed(true);
        let subredditLists = [];
        for (let i = 0; i < subreddits.length; i++) {
          const subredditList = await getSubredditList(subreddits[i]);
          subredditLists = [...subredditLists, ...subredditList];
        }
        const randomisedSubredditLists = shuffleArray(subredditLists);
        setRedditLists((prevLists) => {
          return {
            ...prevLists,
            [category]: {
              list: randomisedSubredditLists,
              index: 0,
            },
          };
        });
      };
      if (category !== currentCategory) setCurrentCategory(category);
      if (!categoryExists(category) && !fetchingPosts) {
        setFetchingPosts(true);
        await refreshRedditList(subreddits, category);
        setFetchingPosts(false);
        setCurrentCategory(category);
      } else if (categoryExists(category)) {
        incrementIndex();
      }
      return () => setFetchingPosts(false);
    },
    [categoryExists, currentCategory, fetchingPosts, incrementIndex, welcomed]
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

  // CONSTANTS
  const finishedList =
    categoryExists() &&
    redditLists[currentCategory].index === redditLists[currentCategory].length
      ? currentCategory
      : false;
  const RedditContextValue = {
    getNextPost,
    currentPost: categoryExists()
      ? redditLists[currentCategory].list[redditLists[currentCategory].index]
      : null,
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
