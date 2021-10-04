import { useEffect, useState, useCallback } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
// APIs
import { getRedditData, getCommentData } from "./API/reddit";
import {
  getButtons,
  getData,
  initFirebaseAuth,
  getInitStatus,
} from "./API/firebase/firebase";

// styles
import "./App.css";

// components
import NavBar from "./components/NavBar";
import About from "./components/About";
import Canvas from "./components/Canvas";
import Settings from "./components/Settings";
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
  const [pullCount, setPullCount] = useState(10);

  const resetAllData = () => {
    setButtons(null);
    setRedditLists(null);
    setCurrentCategory(null);
  };

  // FIREBASE
  const [user, setUser] = useState(undefined);
  const [userSettings, setUserSettings] = useState(undefined);

  const authStateObserver = (user) => {
    user ? setUser(user) : setUser(undefined);
  };

  const isInitialized = getInitStatus();

  // Pass Firebase authStateObserver
  useEffect(() => {
    if (isInitialized) {
      initFirebaseAuth(authStateObserver);
    }
  }, [isInitialized]);

  // Get default buttons from database
  const setDefaults = useCallback(async () => {
    if (!!user) return;
    resetAllData();
    let isSubscribed = true;
    const defaultButtons = await getData.defaultButtons();
    if (isSubscribed) setButtons(defaultButtons);
    return () => (isSubscribed = false);
  }, [user]);

  // Set default buttons on mount
  useEffect(() => {
    setDefaults();
  }, [user]);

  // get user buttons from database
  const setUserState = useCallback(async () => {
    resetAllData();
    let isSubscribed = true;
    const userData = await getData.userData(user.uid);
    if (isSubscribed) {
      setButtons(userData.buttons);
      setUserSettings(userData.settings);
    }
    return () => (isSubscribed = false);
  }, [user]);

  // set user buttons on sign-in
  useEffect(() => {
    if (!user) return;
    setUserState();
  }, [user]);

  // REDDIT
  const categoryExists = useCallback(
    (category = currentCategory) =>
      !!currentCategory && !!redditLists && !!redditLists[category],
    [currentCategory, redditLists]
  );

  const listFinished = useCallback(
    (category = currentCategory) =>
      redditLists[category].index === redditLists[category].list.length
        ? category
        : false,
    [currentCategory, redditLists]
  );
  const getNextPost = useCallback(
    async ({ subreddits, category }) => {
      const refreshRedditList = async (subreddits, category) => {
        const getSubredditList = async (subreddit) => {
          const redditResponse = await getRedditData({
            subreddit,
            limit: pullCount,
          });
          return redditResponse;
        };
        if (!welcomed) setWelcomed(true);
        let subredditLists = [];
        for (let i = 0; i < subreddits.length; i++) {
          const subredditList = await getSubredditList(subreddits[i]);
          subredditLists = [...subredditLists, ...subredditList];
        }
        // randomise list
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
      } else if (categoryExists(category) && !listFinished(category)) {
        const incrementIndex = (category) => {
          setRedditLists((prevLists) => {
            return {
              ...prevLists,
              [category]: {
                ...prevLists[category],
                index: prevLists[category].index + 1,
              },
            };
          });
        };
        incrementIndex(category);
      }
      return () => setFetchingPosts(false);
    },
    [categoryExists, currentCategory, fetchingPosts, listFinished, welcomed]
  );

  // CONTEXT VALUES
  const RedditContextValue = {
    getNextPost,
    currentPost: categoryExists()
      ? redditLists[currentCategory].list[redditLists[currentCategory].index]
      : null,
    fetchingPosts,
    finishedList: categoryExists() && listFinished(),
  };

  console.log(RedditContextValue.currentPost);

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
          <NavBar user={user} />
          <Switch>
            <Route exact path="/">
              <Canvas welcomed={welcomed} />
              <ButtonBox buttons={buttons} />
            </Route>
            <Route path="/about">
              <About />
            </Route>
            <Route path="/settings">
              <Settings
                resetAllData={resetAllData}
                uid={user && user.uid}
                userSettings={userSettings}
                setUserSettings={setUserSettings}
              />
            </Route>
          </Switch>
        </Router>
      </RedditPostContext.Provider>
    </main>
  );
}

export default App;
