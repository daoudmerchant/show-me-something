import { useContext, useState, useEffect, useRef } from "react";
import { RedditPostContext } from "../contexts";
import ReactMarkdown from "react-markdown";

// utils
import { insertLineBreaks } from "../utils";
import Comments from "./Comments";

const Post = () => {
  const { currentPost } = useContext(RedditPostContext);

  // state
  const [readyToPlay, setReadyToPlay] = useState({});

  // refs
  const videoElement = useRef(null);
  const audioElement = useRef(null);

  useEffect(() => {
    setReadyToPlay({});
  }, [currentPost]);

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
          <video className="video" ref={videoElement}>
            <source
              src={currentPost.content.videourl}
              type="video/mp4"
              onLoad={() =>
                setReadyToPlay((prevState) => {
                  return {
                    ...prevState,
                    video: true,
                  };
                })
              }
            />
            Sorry, your browser doesn't support embedded videos.
          </video>
          <audio ref={audioElement} style={{ display: "none" }}>
            <source src={currentPost.content.audiourl} type="audio/mp4" />
          </audio>
        </div>
      );
    }
    if (currentPost.type === "website" || currentPost.type === "link") {
      return (
        <iframe
          title={currentPost.title}
          src={currentPost.content.url}
          onLoad={(e) => {
            try {
              console.log(e.target.contentWindow.name);
            } catch (error) {
              if (
                error.message.includes("Refused to display") ||
                error.message.includes("frame-ancestors")
              ) {
                alert(error.message);
              }
            }
          }}
        />
      );
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
