import { useEffect, useState, useCallback } from "react";
import "./App.css";
import { getRedditData } from "./API/reddit";

function App() {
  const [response, setResponse] = useState(null);
  const getResponse = useCallback(async () => {
    const redditResponse = await getRedditData();
    console.log(redditResponse);
    setResponse(redditResponse);
  }, []);
  useEffect(() => {
    getResponse();
  }, [getResponse]);
  return <div className="App"></div>;
}

export default App;
