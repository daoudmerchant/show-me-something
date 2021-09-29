import { useContext, useState, useEffect } from "react";
import { RedditPostContext } from "../contexts";
import ReactMarkdown from "react-markdown";

// utils
import { insertLineBreaks } from "../utils";
import Comments from "./Comments";

const Post = () => {
  const { currentPost } = useContext(RedditPostContext);
  const [galleryIndex, setGalleryIndex] = useState(0);

  useState(() => {
    setGalleryIndex(0);
  }, [currentPost]);

  const galleryForward = () => {
    console.log("Forward");
    if (galleryIndex + 1 < currentPost.content.images.length) {
      setGalleryIndex((prev) => prev + 1);
      return;
    }
    setGalleryIndex(0);
  };

  const galleryBack = () => {
    console.log("Backward");
    if (galleryIndex !== 0) {
      setGalleryIndex((prev) => prev - 1);
      return;
    }
    setGalleryIndex(currentPost.content.images.length - 1);
  };

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
    if (currentPost.type === "gallery") {
      return (
        <div className="mediacontainer">
          <div className="gallerynav galleryleft" onClick={galleryBack}>
            ◄
          </div>
          <img
            style={{
              aspectRatio: `${currentPost.content.images[galleryIndex].width} / ${currentPost.content.images[galleryIndex].height}`,
            }}
            className="imgpost"
            srcSet={currentPost.content.images[galleryIndex]
              .map((image) => `${image.url} ${image.width}w`)
              .join(", ")}
            src={currentPost.content.fallback}
            alt={currentPost.title}
          />
          <div className="gallerynav galleryright" onClick={galleryForward}>
            ►
          </div>
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
          <video
            className="video"
            // for now
            autoPlay
            //
          >
            <source src={currentPost.content.videourl} type="video/mp4" />
            Sorry, your browser doesn't support embedded videos.
          </video>
          <audio style={{ display: "none" }} autoPlay>
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
