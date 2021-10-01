import { useState, useEffect } from "react";

const Image = ({ currentImage, currentTitle }) => {
  // TODO: Fix image placeholder
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(false);
  }, [currentImage]);

  const { width, height } = currentImage.images[0];

  const placeholder = `<svg viewBox="0 0 ${width} ${height}" width=${width} height=${height} preserveAspectRatio="none"><rect width="100%" height="100%" fill="grey"/></svg>`;

  const placeholder64 = Buffer.from(placeholder).toString("base64");

  const placeholderURL =
    "url('data:image/svg+xml;base64," + placeholder64 + "')";

  return (
    <div
      className="mediacontainer"
      style={{
        backgroundImage: placeholderURL,
        backgroundSize: "contain",
      }}
    >
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
        onLoad={() => setIsLoaded(true)}
      />
    </div>
  );
};

export default Image;
