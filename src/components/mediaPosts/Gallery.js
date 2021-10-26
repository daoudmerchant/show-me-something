import { useState, useEffect, useContext } from "react";
import { RedditPostContext } from "../../constants/contexts";

import "../../styles/Gallery.css";

// components
import Image from "./Image";

const Gallery = () => {
  const [galleryIndex, setGalleryIndex] = useState(0);
  const { currentPost } = useContext(RedditPostContext);

  useEffect(() => {
    setGalleryIndex(0);
  }, [currentPost]);

  const galleryForward = () => {
    if (galleryIndex + 1 < currentPost.media.content.gallery.length) {
      setGalleryIndex((prev) => prev + 1);
      return;
    }
    setGalleryIndex(0);
  };

  const galleryBack = () => {
    if (galleryIndex !== 0) {
      setGalleryIndex((prev) => prev - 1);
      return;
    }
    setGalleryIndex(currentPost.media.content.gallery.length - 1);
  };

  return (
    <div className="gallerycontainer">
      <div className="gallerynav galleryleft" onClick={galleryBack}>
        ◄
      </div>
      <Image
        currentImage={currentPost.media.content.gallery[galleryIndex]}
        currentTitle={currentPost.title}
      />
      <div className="gallerynav galleryright" onClick={galleryForward}>
        ►
      </div>
    </div>
  );
};

export default Gallery;
