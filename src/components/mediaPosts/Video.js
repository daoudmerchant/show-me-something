import { useContext, useRef, useState, useEffect } from "react";
import { RedditPostContext } from "../../contexts";

// components
import Loading from "../Loading";

const Video = () => {
  const { currentPost } = useContext(RedditPostContext);
  const [isLoaded, setIsLoaded] = useState(false);
  console.log(currentPost);

  useEffect(() => {
    setIsLoaded(false);
  }, [currentPost]);

  // refs
  const vidRef = useRef();
  const audioRef = useRef();

  const playAndPause = () => {
    const isPlaying = !vidRef.current.paused;
    const playOrPause = isPlaying ? "pause" : "play";
    vidRef.current[playOrPause]();
    audioRef.current[playOrPause]();
  };

  const volumeUp = () => {
    const volume = audioRef.current.volume;
    if (volume === 1) return;
    vidRef.current.volume = volume + 0.2;
    audioRef.current.volume = volume + 0.2;
  };

  const volumeDown = () => {
    const volume = audioRef.current.volume;
    if (!volume) return;
    vidRef.current.volume = volume - 0.2;
    audioRef.current.volume = volume - 0.2;
  };

  return (
    <div className="mediacontainer">
      {isLoaded || <Loading type="VIDEO" />}
      {!!currentPost.media.local ? (
        <>
          <video
            ref={vidRef}
            className="video"
            style={{ display: isLoaded ? undefined : "none" }}
            onLoadedData={() => {
              alert("Loaded!");
              setIsLoaded(true);
            }}
          >
            <source
              src={currentPost.media.content.videourl}
              type={`video/${currentPost.media.content.format}`}
            />
            Sorry, your browser doesn't support embedded videos.
          </video>
          <audio ref={audioRef} style={{ display: "none" }}>
            <source src={currentPost.media.content.audiourl} type="audio/mp4" />
          </audio>
          <div id="playpause" onClick={playAndPause}>
            Play/Pause
          </div>
          <div id="volumecontrols">
            <div id="volumeup" onClick={volumeUp}>
              Up
            </div>
            <div id="volumedown" onClick={volumeDown}>
              Down
            </div>
          </div>
        </>
      ) : (
        // video from outside Reddit, no choice...
        <div
          className="hostedvideo"
          dangerouslySetInnerHTML={{ __html: currentPost.media.content.html }}
          style={{ display: isLoaded ? undefined : "none" }}
          // TODO: Check onload function!
          onLoad={() => {
            setIsLoaded(true);
          }}
        />
      )}
    </div>
  );
};

export default Video;
