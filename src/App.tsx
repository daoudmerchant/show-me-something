import { useEffect, useState, useCallback } from "react";
import "./App.css";
import { getRedditData, getCommentData } from "./API/reddit";

function App() {
  const [response, setResponse] = useState([]);
  const [comments, setComments] = useState([]);
  const getResponse = useCallback(async () => {
    const redditResponse = await getRedditData();
    console.log(redditResponse);
    setResponse(redditResponse);
  }, []);
  const getComments = useCallback(async (url: string, quantity: number) => {
    const comments = await getCommentData(url, quantity);
    console.log(comments);
    // @ts-ignore
    setComments(comments);
  }, []);
  useEffect(() => {
    getResponse();
  }, [getResponse]);
  useEffect(() => {
    if (!!response.length && !comments.length) {
      // @ts-ignore
      const url = response[0].url;
      console.log(url);
      getComments(url, 5);
    }
  });
  return <div className="App"></div>;
}

export default App;
