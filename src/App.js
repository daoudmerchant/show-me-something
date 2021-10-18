import { useEffect, useState, useCallback } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

// APIs
import { getRedditData } from "./API/reddit";
import {
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
import ButtonSettings from "./components/ButtonSettings";

// contexts
import { RedditPostContext } from "./contexts";

// utils
import { shuffleArray } from "./utils";

function App() {
  // STATE
  const [buttons, setButtons] = useState(null);
  const [settings, setSettings] = useState(null);
  const [fetchingPosts, setFetchingPosts] = useState(false);
  const [welcomed, setWelcomed] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [redditLists, setRedditLists] = useState(null);

  const resetAllData = () => {
    // TODO: Update
    setButtons(null);
    setSettings(null);
    setRedditLists(null);
    setCurrentCategory(null);
  };

  // FIREBASE
  const [user, setUser] = useState(undefined);

  const authStateObserver = (user) => {
    console.log(user);
    user ? setUser(user) : setUser(undefined);
  };

  const isInitialized = getInitStatus();

  // Pass Firebase authStateObserver
  useEffect(() => {
    if (!isInitialized) return;
    initFirebaseAuth(authStateObserver);
  }, [isInitialized]);

  // Get default buttons from database
  const getDefaults = useCallback(async () => {
    if (!!user) return;
    resetAllData();
    let isSubscribed = true;
    const defaultData = await getData.defaults();
    if (isSubscribed) {
      setButtons(defaultData.buttons);
      setSettings(defaultData.settings);
    }
    return () => (isSubscribed = false);
  }, [user]);

  // Set default buttons on mount
  useEffect(() => {
    getDefaults();
  }, [user]);

  // get user buttons from database
  const setUserState = useCallback(async () => {
    resetAllData();
    let isSubscribed = true;
    const userData = await getData.userData(user.uid);
    if (isSubscribed) {
      setButtons(userData.buttons);
      setSettings(userData.settings);
    }
    return () => (isSubscribed = false);
  }, [user]);

  // set user buttons on sign-in
  useEffect(() => {
    if (!user) return;
    setUserState();
  }, [setUserState, user]);

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
        console.log(subreddits);
        const getSubredditList = async (subreddit) => {
          const redditResponse = await getRedditData({
            ...settings,
            subreddit,
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
    [
      categoryExists,
      currentCategory,
      fetchingPosts,
      listFinished,
      settings,
      welcomed,
    ]
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
  console.log(buttons);

  return (
    <main className="App">
      <Router>
        <NavBar user={user} />
        <RedditPostContext.Provider value={RedditContextValue}>
          <Switch>
            <Route exact path="/">
              <div id="appcontainer">
                <Canvas welcomed={welcomed} />
                <ButtonBox buttons={buttons} />
              </div>
            </Route>
            <Route path="/about">
              <About />
            </Route>
            <Route path="/settings">
              <Settings
                resetAllData={resetAllData}
                uid={user && user.uid}
                settings={settings}
                setSettings={setSettings}
                buttons={buttons}
                setButtons={setButtons}
              />
            </Route>
          </Switch>
        </RedditPostContext.Provider>
      </Router>
    </main>
  );
}

export default App;
