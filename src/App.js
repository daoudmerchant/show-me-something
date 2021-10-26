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
import "./styles/App.css";

// components
import NavBar from "./components/NavBar";
import About from "./components/About";
import Canvas from "./components/Canvas";
import Settings from "./components/Settings";
import ButtonBox from "./components/ButtonBox";

// contexts
import { RedditPostContext } from "./constants/contexts";

// utils
import { shuffleArray } from "./utils";

function App() {
  // STATE
  const [firebaseReady, setFirebaseReady] = useState({
    initialized: false,
    observed: false,
  });
  const [user, setUser] = useState(undefined);
  const [buttons, setButtons] = useState(null);
  const [settings, setSettings] = useState(null);
  const [fetchingPosts, setFetchingPosts] = useState(false);
  const [welcomed, setWelcomed] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [redditLists, setRedditLists] = useState(null);

  const confirmWelcomed = useCallback(() => {
    if (welcomed) return;
    setWelcomed(true);
  }, [welcomed]);

  const resetAllData = useCallback(() => {
    // TODO: Update
    const data = [
      {
        state: buttons,
        setState: setButtons,
      },
      {
        state: settings,
        setState: setSettings,
      },
      {
        state: redditLists,
        setState: setRedditLists,
      },
      {
        state: currentCategory,
        setState: currentCategory,
      },
    ];
    data.forEach((dataset) => {
      if (!dataset.state) return;
      dataset.setState(null);
    });
  }, [buttons, currentCategory, redditLists, settings]);

  // FIREBASE
  // observer function
  const authStateObserver = (user) => {
    user
      ? setUser(() => ({ ...user, displayName: user.displayName.split(" ") }))
      : setUser(undefined);
  };

  // SET-UP
  // Report initialized
  useEffect(() => {
    if (firebaseReady.initialized || !getInitStatus()) return;
    setFirebaseReady((prevStatus) => ({ ...prevStatus, initialized: true }));
  }, [firebaseReady.initialized]);

  // Pass observer and report observed
  useEffect(() => {
    if (!firebaseReady.initialized || firebaseReady.observed) return;
    // Pass Firebase authStateObserver
    initFirebaseAuth(authStateObserver);
    setFirebaseReady((prevStatus) => ({ ...prevStatus, observed: true }));
  }, [firebaseReady]);

  // Firebase query
  const getFirebaseData = useCallback(
    async (fn, arg) => {
      resetAllData();
      let isSubscribed = true;
      const data = await fn(arg);
      if (isSubscribed) {
        setButtons(data.buttons);
        setSettings(data.settings);
      }
      return () => (isSubscribed = false);
    },
    [resetAllData]
  );

  // Set buttons and settings on user change
  useEffect(() => {
    if (!user) {
      getFirebaseData(getData.defaults);
      return;
    }
    getFirebaseData(getData.userData, user.uid);
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
            ...settings,
            subreddit,
          });
          return redditResponse;
        };
        confirmWelcomed();
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
      confirmWelcomed,
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
  return (
    <div className="App">
      <Router>
        <NavBar user={user} confirmWelcomed={confirmWelcomed} />
        <RedditPostContext.Provider value={RedditContextValue}>
          <main>
            <Switch>
              <Route exact path="/">
                <div id="appcontainer">
                  <Canvas
                    welcomed={welcomed}
                    showContent={
                      settings && {
                        promptOnNSFW: settings.promptOnNSFW,
                        promptOnSpoiler: settings.promptOnSpoiler,
                      }
                    }
                  />
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
          </main>
        </RedditPostContext.Provider>
      </Router>
    </div>
  );
}

export default App;
