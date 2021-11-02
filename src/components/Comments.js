import { useState, useCallback, useEffect, useContext } from "react";
import { useMediaQuery } from "react-responsive";
import { useHistory } from "react-router";
import ReactMarkdown from "react-markdown";

// API
import { getCommentData } from "../API/reddit";

// styles
import "../styles/Comments.min.css";

// context
import { RedditPostContext } from "../constants/contexts";

// components
import Prompt from "./Prompt";
import Loading from "./Loading";

const Comments = () => {
  // state
  const [clicked, setClicked] = useState(false);
  const [comments, setComments] = useState(null);

  // history
  const history = useHistory();

  // context
  const { currentPost } = useContext(RedditPostContext);

  // state management
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
          comments.map((comment, i) => {
            if (!comment.content || !comment.author) {
              // adding conditional return to .map to prevent
              // two array functions for efficiency
              // eslint-disable-next-line
              return;
            }
            return (
              <div className="commentbox" key={`comment${i}`}>
                <div className="commentcontent">
                  <ReactMarkdown>{comment.content}</ReactMarkdown>
                </div>
                <hr />
                <p className="author">{`- ${comment.author}`}</p>
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
          <Loading type="COMMENTS" />
        )}
      </div>
    </div>
  );
};

export default Comments;
