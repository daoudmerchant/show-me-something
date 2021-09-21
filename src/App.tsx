import { useEffect, useState, useCallback } from "react";
import "./App.css";
import { getRedditData, getCommentData } from "./API/reddit";
import { getDefaultButtons } from "./API/firebase/firebase";

// components
import Canvas from "./components/Canvas";
import ButtonBox from "./components/ButtonBox";

// context
import { RedditPostContext } from "./contexts";

function App() {
  const [buttons, setButtons] = useState([]);
  const [response, setResponse] = useState([]);
  const getResponse = useCallback(async (subreddit) => {
    const redditResponse = await getRedditData({ subreddit });
    console.log(redditResponse);
    // @ts-ignore
    setResponse((prevResponse) => {
      return [...prevResponse, ...redditResponse];
    });
  }, []);
  const getButtons = useCallback(async () => {
    let isSubscribed = true;
    const defaultButtons = await getDefaultButtons();
    console.log(defaultButtons);
    // @ts-ignore
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
      <RedditPostContext.Provider value={getResponse}>
        {/*
        // @ts-ignore */}
        {!!response.length && (
          // @ts-ignore
          <Canvas content={response && response[0].title} />
        )}
        {/*
      // @ts-ignore */}
        {!!buttons.length && <ButtonBox buttons={buttons} />}
      </RedditPostContext.Provider>
    </main>
  );
}

export default App;
