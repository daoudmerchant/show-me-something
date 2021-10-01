import { useContext, useRef } from "react";
import { RedditPostContext } from "../../contexts";

const Video = () => {
  const { currentPost } = useContext(RedditPostContext);

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
      <video ref={vidRef} className="video">
        <source src={currentPost.content.videourl} type="video/mp4" />
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
    </div>
  );
};

export default Video;
