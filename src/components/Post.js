import { useContext, useState, useEffect, useMemo } from "react";
import { RedditPostContext } from "../constants/contexts";
import ReactMarkdown from "react-markdown";

import "../styles/Post.css";

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
  const [NSFWvisible, setNSFWVisible] = useState(false);
  const [spoilerVisible, setSpoilerVisible] = useState(false);

  const postHasNoFlags = FLAGS.every((flag) => {
    return !currentPost[flag];
  });

  const postVisibility = useMemo(
    () => ({
      NSFW: {
        visibility: NSFWvisible,
        confirm: () => setNSFWVisible(true),
        deny: () => setNSFWVisible(false),
      },
      spoiler: {
        visibility: spoilerVisible,
        confirm: () => setSpoilerVisible(true),
        deny: () => setNSFWVisible(false),
      },
    }),
    [NSFWvisible, spoilerVisible]
  );

  // set content visibility state on render
  useEffect(() => {
    if (!showContent || postHasNoFlags) return;
    FLAGS.forEach((flag) => {
      if (!showContent[`${flag}prompt`]) postVisibility[flag].confirm();
    });
  }, [postHasNoFlags, postVisibility, showContent]);

  // reset visibility on next post
  useEffect(() => {
    if (!showContent || postHasNoFlags) return;
    FLAGS.forEach((flag) => {
      if (showContent[`${flag}prompt`]) postVisibility[flag].deny();
    });
  }, [currentPost]);

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
        <div className="mediacontainer">
          <div className="textpost">
            {insertLineBreaks(currentPost.media.content.text).map((string) => (
              <ReactMarkdown linkTarget="_blank">{string}</ReactMarkdown>
            ))}
          </div>
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
      return (
        <p>
          View external content at source{" "}
          <a
            href={currentPost.media.content.url}
            rel="noreferrer"
            target="_blank"
          >
            here
          </a>
          .
        </p>
      );
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
  if (!postHasNoFlags && (NSFWvisible === null || spoilerVisible === null))
    return null;

  return (
    <div id="post">
      <div className="posttitle">
        <div
          id="likepercentage"
          style={{
            background: `linear-gradient(to top, lime, lime ${currentPost.controversiality}%, red ${currentPost.controversiality}%, red)`,
          }}
        >
          {currentPost.controversiality}%
        </div>
        <h2>{currentPost.title}</h2>
        <a
          id="externallink"
          href={currentPost.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            id="newwindowicon"
            src={newwindowicon}
            alt="open link in a new window"
          />
        </a>
      </div>
      {(() => {
        if (postHasNoFlags) {
          return <PostBody />;
        }
        for (let i = 0; i < FLAGS.length; i++) {
          if (currentPost[FLAGS[i]])
            return postVisibility[FLAGS[i]].visibility ? (
              <PostBody />
            ) : (
              <Prompt
                type={FLAGS[i]}
                confirm={postVisibility[FLAGS[i]].confirm}
              />
            );
        }
      })()}
    </div>
  );
};

export default Post;
