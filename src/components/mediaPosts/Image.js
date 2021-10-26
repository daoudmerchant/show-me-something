import { useState, useEffect } from "react";

import "../../styles/Image.css";

// components
import Loading from "../Loading";

const Image = ({ currentImage, currentTitle }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => setIsLoaded(false), [currentImage]);

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
      />
    </div>
  );
};

export default Image;
