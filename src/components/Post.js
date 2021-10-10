import { useState, useContext, useEffect } from "react";
import { RedditPostContext } from "../contexts";
import ReactMarkdown from "react-markdown";

// images
import newwindowicon from "../images/newwindow.png";

// utils
import { insertLineBreaks } from "../utils";

// components
import Image from "./mediaPosts/Image";
import Gallery from "./mediaPosts/Gallery";
import Video from "./mediaPosts/Video";
import Website from "./mediaPosts/Website";
import Comments from "./Comments";

const Post = () => {
  const { currentPost } = useContext(RedditPostContext);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(false);
  }, [currentPost]);

  const reportLoaded = () => setIsLoaded(true);

  const Content = () => {
    if (currentPost.type.media === "image") {
      return (
        <Image
          currentImage={currentPost.content}
          currentTitle={currentPost.title}
        />
      );
    }
    if (currentPost.type.media === "gallery") {
      return <Gallery />;
    }
    if (currentPost.type.media === "text") {
      return (
        <div className="textpost">
          {insertLineBreaks(currentPost.content.text).map((string) => (
            <ReactMarkdown linkTarget="_blank">{string}</ReactMarkdown>
          ))}
        </div>
      );
    }
    if (currentPost.type.media === "video") {
      return <Video />;
    }
    if (currentPost.type.media === "website") {
      return <Website />;
    }
    return <p>{currentPost.type}</p>;
  };
  return (
    <div id="post">
      <div className="posttitle">
        <p id="likepercentage">{currentPost.controversiality * 100}%</p>
        <h2>{currentPost.title}</h2>
        <a
          id="externallink"
          href={currentPost.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span id="newwindowtext">View on Reddit</span>
          <img
            id="newwindowicon"
            src={newwindowicon}
            alt="open link in a new window"
          />
        </a>
      </div>
      {
        // TODO: Add fetching content
      }
      <Content
        reportLoaded={reportLoaded}
        style={{ display: isLoaded ? undefined : "none" }}
      />
      <Comments />
    </div>
  );
};

export default Post;
