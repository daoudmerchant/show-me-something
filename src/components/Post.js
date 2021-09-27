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
        <div className="mediacontainer forimage">
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
        <div className="mediacontainer fortext">
          {insertLineBreaks(currentPost.text).map((string) => (
            <ReactMarkdown linkTarget="_blank">{string}</ReactMarkdown>
          ))}
        </div>
      );
    }
    const Iframe = () => (
      <iframe
        className={
          currentPost.type.includes("video") ? "hostedvideo" : "hostedsite"
        }
        title={currentPost.title}
        src={currentPost.content.url}
        style={{
          aspectRatio:
            currentPost.type.includes("video") &&
            `${currentPost.content.width} / ${currentPost.content.height}`,
          border: "0",
        }}
      ></iframe>
    );
    if (currentPost.type.includes("video")) {
      return (
        <div className="mediacontainer forvideo">
          <Iframe />
        </div>
      );
    }
    if (currentPost.type === "website") {
      return (
        <div className="mediacontainer forwebsite">
          <Iframe />
        </div>
      );
    }
    return <p>{currentPost.type}</p>;
    // ) : {
    //   const
    //   currentPost.type.includes("video") ? (
    //   <iframe src={currentPost.content.url} title={currentPost.title}></iframe>
    // ) : (
    //   <p>Neither text nor video</p>
    // )};
  };
  return (
    <div id="post">
      <div id="postcontainer">
        <div className="posttitle">
          <h2>{currentPost.title}</h2>
        </div>
        <Content />
      </div>
      <Comments />
    </div>
  );
};

export default Post;
