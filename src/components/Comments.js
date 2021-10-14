import { useState, useCallback, useEffect, useContext } from "react";
import { useMediaQuery } from "react-responsive";

// context
import { RedditPostContext } from "../contexts";

// API
import { getCommentData } from "../API/reddit";

const Comments = () => {
  // state
  const [clicked, setClicked] = useState(false);
  const [comments, setComments] = useState(null);

  // context
  const { currentPost } = useContext(RedditPostContext);

  // functions
  const toggleClicked = () => setClicked((prevClicked) => !prevClicked);

  // media query
  const isTouchscreen = useMediaQuery({ query: "(hover: none)" });

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
      id="comments"
      onClick={handleClick}
      style={{
        height: clicked ? "100%" : "50px",
        overflowY: clicked ? "scroll" : "hidden",
      }}
    >
      <div id="commentheader">{`${isTouchscreen ? "Tap" : "Click"} to ${
        clicked ? "close" : "expand"
      } comments`}</div>
      <div id="commentcontainer">
        {comments ? (
          comments.map((comment) => {
            if (!comment.content || !comment.author) {
              return;
            }
            return (
              <div className="commentbox">
                <p>{`"${comment.content}"`}</p>
                <hr />
                <p>{`- ${comment.author}`}</p>
              </div>
            );
          })
        ) : (
          <p>Loading comments...</p>
        )}
      </div>
    </div>
  );
};

export default Comments;
