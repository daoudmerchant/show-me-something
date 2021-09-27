import { useState } from "react";

const Comments = () => {
  const [clicked, setClicked] = useState(false);
  const toggleClicked = () => setClicked((prevClicked) => !prevClicked);
  return (
    <div
      id="comments"
      onClick={toggleClicked}
      style={{ height: clicked ? "100%" : "20px" }}
    >
      Comments
    </div>
  );
};

export default Comments;
