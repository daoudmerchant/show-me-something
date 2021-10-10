const Image = ({ currentImage, currentTitle, reportLoaded }) => {
  console.log(currentImage);

  return (
    <div className="mediacontainer">
      <img
        style={{
          aspectRatio: currentImage.width / currentImage.height,
        }}
        id="imgpost"
        srcSet={currentImage.images
          .map((image) => `${image.url} ${image.width}w`)
          .join(", ")}
        src={currentImage.fallback}
        alt={currentTitle}
        onLoad={reportLoaded}
      />
    </div>
  );
};

export default Image;
