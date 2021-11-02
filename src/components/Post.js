import { useContext, useState, useEffect, useMemo } from "react";
import ReactMarkdown from "react-markdown";

// styles
import "../styles/Post.min.css";

// constants
import { FLAGS } from "../constants/variables";

// utils
import { insertLineBreaks } from "../utils";

// context
import { RedditPostContext } from "../constants/contexts";

// images
import newwindowicon from "../images/newwindow.png";

// components
import Prompt from "./Prompt";
import Image from "./mediaPosts/Image";
import Gallery from "./mediaPosts/Gallery";
import Video from "./mediaPosts/Video";
import Wikipedia from "./mediaPosts/Wikipedia";
import Comments from "./Comments";

const Post = ({ showContent }) => {
  // state
  const { currentPost } = useContext(RedditPostContext);
  const [NSFWvisible, setNSFWVisible] = useState(false);
  const [spoilerVisible, setSpoilerVisible] = useState(false);

  // variables
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
    // only run on post chage
    // eslint-disable-next-line
  }, [currentPost]);

  // CONTENT
  const Content = () => {
    switch (currentPost.media.type) {
      case "image":
        return (
          <Image
            currentImage={currentPost.media.content}
            currentTitle={currentPost.title}
          />
        );
      case "gallery":
        return <Gallery />;
      case "text":
        return (
          <div className="mediacontainer">
            <div className="textpost">
              {insertLineBreaks(currentPost.media.content.text).map(
                (string) => (
                  <ReactMarkdown linkTarget="_blank">{string}</ReactMarkdown>
                )
              )}
            </div>
          </div>
        );
      case "video":
        return <Video />;
      case "wikipedia":
        return <Wikipedia />;
      case "website":
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
      default:
        return (
          <p>{`Oops, I haven't got round to handling "${currentPost.type}" posts yet... Sorry!`}</p>
        );
    }
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
