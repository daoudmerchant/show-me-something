import { useContext } from "react";
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

  const Content = () => {
    if (currentPost.type === "image") {
      return (
        <Image
          currentImage={currentPost.content}
          currentTitle={currentPost.title}
        />
      );
    }
    if (currentPost.type === "gallery") {
      return <Gallery />;
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
      return <Video />;
    }
    if (currentPost.type === "website" || currentPost.type === "link") {
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
      <Content />
      <Comments />
    </div>
  );
};

export default Post;
