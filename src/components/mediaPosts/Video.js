import { useContext, useRef } from "react";
import { RedditPostContext } from "../../contexts";

const Video = ({ isLoaded, reportLoaded }) => {
  const { currentPost } = useContext(RedditPostContext);

  console.log(currentPost);

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
      {currentPost.type.local ? (
        <>
          <video ref={vidRef} className="video" onLoad={reportLoaded}>
            <source
              src={currentPost.content.videourl}
              type={`video/${currentPost.content.format}`}
            />
            Sorry, your browser doesn't support embedded videos.
          </video>
          <audio ref={audioRef} style={{ display: "none" }}>
            <source src={currentPost.content.audiourl} type="audio/mp4" />
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
          dangerouslySetInnerHTML={{ __html: currentPost.content.html }}
        />
      )}
    </div>
  );
};

export default Video;
