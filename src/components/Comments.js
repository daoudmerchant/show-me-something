import { useState, useCallback, useEffect, useContext, useRef } from "react";

// context
import { RedditPostContext } from "../contexts";

// API
import { getCommentData } from "../API/reddit";

const Comments = () => {
  // state
  const [clicked, setClicked] = useState(false);
  const [comments, setComments] = useState(null);
  console.log(comments);

  // ref
  const commentContainer = useRef(null);

  // context
  const { currentPost } = useContext(RedditPostContext);

  // functions
  const toggleClicked = () => setClicked((prevClicked) => !prevClicked);

  const getComments = useCallback(async () => {
    console.log(currentPost.url);
    const postComments = await getCommentData(currentPost.url);
    console.log(postComments);
    setComments(postComments);
  }, [currentPost.url]);

  // - reset on post change
  useEffect(() => {
    setClicked(false);
    setComments(null);
  }, [currentPost]);

  const handleClick = () => {
    if (!comments) getComments();
    toggleClicked();
  };
  return (
    <div
      ref={commentContainer}
      id="comments"
      onClick={handleClick}
      style={{
        height: clicked ? "100%" : "50px",
        overflowY: clicked ? "scroll" : "hidden",
      }}
    >
      <p>Comments</p>
      {comments ? (
        comments.map((comment) => <p>{comment.content}</p>)
      ) : (
        <p>Loading comments...</p>
      )}
    </div>
  );
};

export default Comments;
