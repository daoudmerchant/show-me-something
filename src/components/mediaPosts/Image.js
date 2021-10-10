import { useState, useEffect } from "react";

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
          aspectRatio: currentImage.width / currentImage.height,
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
