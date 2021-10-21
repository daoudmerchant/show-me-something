import { useState, useCallback, useEffect, useContext } from "react";
import { useMediaQuery } from "react-responsive";
import { useHistory } from "react-router";
import ReactMarkdown from "react-markdown";

// context
import { RedditPostContext } from "../contexts";

// API
import { getCommentData } from "../API/reddit";

// components
import Prompt from "./Prompt";

const Comments = () => {
  const history = useHistory();

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
    const postComments = await getCommentData(currentPost.url);
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

  const retryGetComments = () => {
    setComments(null);
    getComments();
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
        {!!comments ? (
          comments.map((comment) => {
            if (!comment.content || !comment.author) {
              return;
            }
            return (
              <div className="commentbox">
                <div className="commentcontent">
                  <ReactMarkdown>{comment.content}</ReactMarkdown>
                </div>
                <hr />
                <p>{`- ${comment.author}`}</p>
              </div>
            );
          })
        ) : comments === false ? (
          <Prompt
            type="RedditError"
            confirm={retryGetComments}
            cancel={() => history.push("/settings")}
          />
        ) : (
          <p>Loading comments...</p>
        )}
      </div>
    </div>
  );
};

export default Comments;
