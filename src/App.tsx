import { useEffect, useState, useCallback } from "react";
import "./App.css";
import { getRedditData, getCommentData } from "./API/reddit";

// components
import Canvas from "./components/Canvas";
import ButtonBox from "./components/ButtonBox";

function App() {
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

  return (
    <main className="App">
      <Canvas />
      <ButtonBox />
    </main>
  );
}

export default App;
