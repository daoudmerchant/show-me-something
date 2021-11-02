import { useEffect, useState, useCallback } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

// APIs
import { getRedditData } from "./API/reddit";
import { getData, initFirebaseAuth, getInitStatus } from "./API/firebase";

// styles
import "./styles/App.css";

// utils
import { shuffleArray } from "./utils";

// context
import { RedditPostContext } from "./constants/contexts";

// components
import NavBar from "./components/NavBar";
import About from "./components/About";
import Canvas from "./components/Canvas";
import Settings from "./components/Settings";
import ButtonBox from "./components/ButtonBox";

function App() {
  // STATE
  const [firebaseReady, setFirebaseReady] = useState({
    initialized: false,
    observed: false,
  });
  const [user, setUser] = useState(undefined);
  const [buttons, setButtons] = useState(undefined);
  const [settings, setSettings] = useState(undefined);
  const [fetchingPosts, setFetchingPosts] = useState(false);
  const [welcomed, setWelcomed] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(undefined);
  const [redditLists, setRedditLists] = useState(undefined);
  const [finishedLists, setFinishedLists] = useState({});

  // state handlers
  const confirmWelcomed = useCallback(() => {
    if (welcomed) return;
    setWelcomed(true);
  }, [welcomed]);

  const resetAllData = useCallback(() => {
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
        setState: setCurrentCategory,
      },
    ];
    data.forEach((dataset) => {
      if (!dataset.state) return;
      dataset.setState(undefined);
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

  // QUERY DATABASE
  const getFirebaseData = useCallback(
    async (fn, arg) => {
      resetAllData();
      let isSubscribed = true;
      const data = await fn(arg);
      if (isSubscribed) {
        if (!!data) {
          setSettings(data.settings);
          setButtons(data.buttons);
          return;
        }
        // failed to fetch
        setSettings(null);
        setButtons(null);
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
    // only run on user change
    // eslint-disable-next-line
  }, [user]);

  // REDDIT
  const categoryExists = useCallback(
    (category = currentCategory) =>
      !!currentCategory && !!redditLists && !!redditLists[category],
    [currentCategory, redditLists]
  );

  // Pull Reddit post data / increment index
  const getNextPost = useCallback(
    async (
      { subreddits, category } = {
        subreddits: buttons.find((button) => button.text === currentCategory)
          .subreddits,
        category: currentCategory,
      }
    ) => {
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
          // failed
          if (!subredditList) {
            continue;
          }
          // succeeded
          subredditLists = [...subredditLists, ...subredditList];
        }
        if (!subredditLists.length) {
          // all failed
          setRedditLists(null);
          return false;
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
        return true;
      };
      // executed code
      if (category !== currentCategory) setCurrentCategory(category);
      if (!categoryExists(category) && !fetchingPosts) {
        // Category not yet pulled
        setFetchingPosts(true);
        await refreshRedditList(subreddits, category);
        setFetchingPosts(false);
      } else if (categoryExists(category)) {
        // Category pulled
        if (
          redditLists[category].index ===
          redditLists[category].list.length - 1
        ) {
          // finished the list
          setFinishedLists((prevLists) => ({
            ...prevLists,
            [category]: true,
          }));
        } else {
          // increment index
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
      }
      return () => setFetchingPosts(false);
    },
    // Ignore 'buttons' from dependency array to avoid recursion
    // eslint-disable-next-line
    [
      currentCategory,
      categoryExists,
      fetchingPosts,
      confirmWelcomed,
      settings,
      redditLists,
    ]
  );

  // CONTEXT VALUES
  const RedditContextValue = {
    getNextPost,
    currentPost:
      redditLists === null
        ? null
        : categoryExists()
        ? redditLists[currentCategory].list[redditLists[currentCategory].index]
        : undefined,
    fetchingPosts,
    finishedLists,
    thisListFinished: finishedLists[currentCategory],
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
                        NSFWprompt: settings.NSFWPrompt,
                        spoilerPrompt: settings.spoilerPrompt,
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
