import { useContext } from "react";
import { RedditPostContext } from "../contexts";
// import { Switch, Route } from "react-router-dom"
import Post from "./Post";
// import User from "./User";
// import Welcome from "./Welcome";

const Canvas = ({ welcomed }) => {
  const { fetchingPosts, finishedList } = useContext(RedditPostContext);
  if (!welcomed) return <div>Welcome!</div>;
  if (fetchingPosts) return <div>Fetching posts</div>;
  if (!!finishedList) return <div>Finished!</div>;
  return <Post />;
};

export default Canvas;
