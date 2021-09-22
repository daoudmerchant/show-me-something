// import { useState } from "react";
// import { Switch, Route } from "react-router-dom"
import Post from "./Post";
// import User from "./User";
// import Welcome from "./Welcome";

const Canvas = ({ welcomed, fetchingPosts, noMorePosts }) => {
  if (!welcomed) return <div>Welcome!</div>;
  if (fetchingPosts) return <div>Fetching posts</div>;
  if (noMorePosts) return <div>Finished!</div>;
  return <Post />;
};

export default Canvas;
