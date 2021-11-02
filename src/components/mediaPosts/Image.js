import { useState, useEffect } from "react";

// styles
import "../../styles/Image.min.css";

// components
import Loading from "../Loading";
import Prompt from "../Prompt";

const Image = ({ currentImage, currentTitle }) => {
  // state
  const [isLoaded, setIsLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  // reset state on image change
  useEffect(() => {
    setIsLoaded(false);
    setFailed(false);
  }, [currentImage]);

  if (failed)
    return <Prompt type="contentError" confirm={() => setFailed(false)} />;

  return (
    <div className="mediacontainer">
      {isLoaded || <Loading type="IMAGE" />}
      <img
        style={{
          aspectRatio: `${currentImage.images[0].width} / ${currentImage.images[0].height}`,
          display: isLoaded ? undefined : "none",
        }}
        id="imgpost"
        srcSet={currentImage.images
          .map((image) => `${image.url} ${image.width}w`)
          .join(", ")}
        src={currentImage.fallback}
        alt={currentTitle}
        onLoad={() => {
          setIsLoaded(true);
        }}
        onError={() => setFailed(true)}
      />
    </div>
  );
};

export default Image;
