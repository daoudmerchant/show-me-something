import { useContext } from "react";
import { RedditPostContext } from "../contexts";

// utils
import { insertLineBreaks } from "../utils";
import Comments from "./Comments";

const Post = () => {
  const { currentPost } = useContext(RedditPostContext);
  console.log(currentPost);
  console.log(insertLineBreaks(currentPost.text));
  const Content = () => {
    if (currentPost.type === "image") {
      return (
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
      );
    }
    if (currentPost.type === "text") {
      return (
        <div className="textpost">{insertLineBreaks(currentPost.text)}</div>
      );
    }
    if (currentPost.type.includes("video")) {
      return (
        <iframe
          style={{
            aspectRatio: `${currentPost.content.width} / ${currentPost.content.height}`,
            border: "none",
          }}
          className="hostedpost"
          src={currentPost.content.url}
          title={currentPost.title}
        ></iframe>
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
      <p className="posttitle">{currentPost.title}</p>
      <div
        className={
          currentPost.type === "image"
            ? "postcontainer forimage"
            : currentPost.type === "text"
            ? "postcontainer fortext"
            : "postcontainer"
        }
      >
        <Content />
      </div>
      <Comments />
    </div>
  );
};

export default Post;
