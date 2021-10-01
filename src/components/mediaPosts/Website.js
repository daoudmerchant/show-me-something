import { useContext } from "react";
import { RedditPostContext } from "../../contexts";

const Website = () => {
  const { currentPost } = useContext(RedditPostContext);

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
};

export default Website;
