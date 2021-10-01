import { useState, useEffect, useContext } from "react";
import { RedditPostContext } from "../../contexts";

// components
import Image from "./Image";

const Gallery = () => {
  const [galleryIndex, setGalleryIndex] = useState(0);
  const { currentPost } = useContext(RedditPostContext);

  useEffect(() => {
    setGalleryIndex(0);
  }, [currentPost]);

  const galleryForward = () => {
    console.log("Forward");
    if (galleryIndex + 1 < currentPost.content.images.length) {
      setGalleryIndex((prev) => prev + 1);
      return;
    }
    setGalleryIndex(0);
  };

  const galleryBack = () => {
    console.log("Backward");
    if (galleryIndex !== 0) {
      setGalleryIndex((prev) => prev - 1);
      return;
    }
    setGalleryIndex(currentPost.content.images.length - 1);
  };

  return (
    <div className="mediacontainer">
      <div className="gallerynav galleryleft" onClick={galleryBack}>
        ◄
      </div>
      <Image
        currentImage={currentPost.content[galleryIndex]}
        currentTitle={currentPost.title}
      />
      <div className="gallerynav galleryright" onClick={galleryForward}>
        ►
      </div>
    </div>
  );
};

export default Gallery;
