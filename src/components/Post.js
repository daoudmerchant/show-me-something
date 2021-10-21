import { useContext, useState, useEffect, useMemo } from "react";
import { RedditPostContext } from "../contexts";
import ReactMarkdown from "react-markdown";

// images
import newwindowicon from "../images/newwindow.png";

// utils
import { insertLineBreaks } from "../utils";

// components
import Prompt from "./Prompt";
import Image from "./mediaPosts/Image";
import Gallery from "./mediaPosts/Gallery";
import Video from "./mediaPosts/Video";
import Wikipedia from "./mediaPosts/Wikipedia";
import Comments from "./Comments";

// constants
const FLAGS = ["NSFW", "spoiler"];

const Post = ({ showContent }) => {
  const { currentPost } = useContext(RedditPostContext);
  const [visibleNSFW, setVisibleNSFW] = useState(null);
  const [visibleSpoiler, setVisibleSpoiler] = useState(null);

  const postHasNoFlags = FLAGS.every((flag) => !currentPost[flag]);

  // namespace props and state for functional access
  const userVisibility = useMemo(
    () => ({
      NSFW: !showContent.promptOnNSFW,
      spoiler: !showContent.promptOnSpoiler,
    }),
    [showContent]
  );

  const postVisibility = useMemo(
    () => ({
      visibleNSFW,
      denyVisibleNSFW: () => setVisibleNSFW(false),
      confirmVisibleNSFW: () => setVisibleNSFW(true),
      visiblespoiler: visibleSpoiler,
      denyVisiblespoiler: () => setVisibleSpoiler(false),
      confirmVisiblespoiler: () => setVisibleSpoiler(true),
    }),
    [visibleNSFW, visibleSpoiler]
  );

  // set content visibility state on render
  useEffect(() => {
    if (!showContent || postHasNoFlags) return;
    FLAGS.forEach((flag) => {
      userVisibility[flag]
        ? postVisibility[`confirmVisible${flag}`]()
        : postVisibility[`denyVisible${flag}`]();
    });
  }, [postHasNoFlags, postVisibility, showContent, userVisibility]);

  // CONTENT
  const Content = () => {
    if (currentPost.media.type === "image") {
      return (
        <Image
          currentImage={currentPost.media.content}
          currentTitle={currentPost.title}
        />
      );
    }
    if (currentPost.media.type === "gallery") {
      return <Gallery />;
    }
    if (currentPost.media.type === "text") {
      return (
        <div className="textpost">
          {insertLineBreaks(currentPost.media.content.text).map((string) => (
            <ReactMarkdown linkTarget="_blank">{string}</ReactMarkdown>
          ))}
        </div>
      );
    }
    if (currentPost.media.type === "video") {
      return <Video />;
    }
    if (currentPost.media.type === "wikipedia") {
      return <Wikipedia />;
    }
    if (currentPost.media.type === "website") {
      return <p>TODO: External link to website</p>;
    }
    return (
      <p>{`Oops, I haven't got round to handling "${currentPost.type}" yet... Sorry!`}</p>
    );
  };

  const PostBody = () => (
    <>
      <Content />
      <Comments />
    </>
  );

  // show no content before state initialisation
  if (!postHasNoFlags && (visibleNSFW === null || visibleSpoiler === null))
    return null;

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
      {(() => {
        if (postHasNoFlags) {
          console.log("No flags!");
          return <PostBody />;
        }
        for (let i = 0; i < FLAGS.length; i++) {
          if (currentPost[FLAGS[i]])
            return postVisibility[`visible${FLAGS[i]}`] ? (
              <PostBody />
            ) : (
              <Prompt
                type={FLAGS[i]}
                confirm={() => postVisibility[`setVisible${FLAGS[i]}`](true)}
              />
            );
        }
      })()}
    </div>
  );
};

export default Post;
