import { useContext } from "react";
import { RedditPostContext } from "../contexts";
import ReactMarkdown from "react-markdown";

// utils
import { insertLineBreaks } from "../utils";
import Comments from "./Comments";

const Post = () => {
  const { currentPost } = useContext(RedditPostContext);
  const Content = () => {
    if (currentPost.type === "image") {
      return (
        <div className="mediacontainer">
          <img
            style={{
              aspectRatio: `${currentPost.content.width} / ${currentPost.content.height}`,
            }}
            className="imgpost"
            srcSet={currentPost.content.images
              .map((image) => `${image.url} ${image.width}w`)
              .join(", ")}
            src={currentPost.content.fallback}
            alt={currentPost.title}
          />
        </div>
      );
    }
    if (currentPost.type === "text") {
      return (
        <div className="textpost">
          {insertLineBreaks(currentPost.text).map((string) => (
            <ReactMarkdown linkTarget="_blank">{string}</ReactMarkdown>
          ))}
        </div>
      );
    }
    if (currentPost.type.includes("video")) {
      return (
        <div className="mediacontainer">
          <video className="video" controls>
            <source src={currentPost.content.url} type="video/mp4" />
            Sorry, your browser doesn't support embedded videos.
          </video>
        </div>
      );
    }
    if (currentPost.type === "website") {
      return <iframe title={currentPost.title} src={currentPost.content.url} />;
    }
    return <p>{currentPost.type}</p>;
  };
  return (
    <div id="post">
      <div className="posttitle">
        <h2>{currentPost.title}</h2>
      </div>
      <Content />
      <Comments />
    </div>
  );
};

export default Post;
