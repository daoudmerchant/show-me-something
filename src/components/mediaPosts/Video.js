import { useContext, useRef, useState, useEffect } from "react";
import { RedditPostContext } from "../../contexts";

import PlayPause from "./playpause.png";
import AudioIcon from "./audio-icon.png";

// components
import Loading from "../Loading";

const Video = () => {
  const { currentPost } = useContext(RedditPostContext);
  const [isLoaded, setIsLoaded] = useState(false);
  const [volume, setVolume] = useState(1);
  console.log(currentPost);

  useEffect(() => {
    setIsLoaded(false);
    setVolume(1);
  }, [currentPost]);

  // refs
  const vidRef = useRef();
  const audioRef = useRef();

  const playAndPause = () => {
    const isPlaying = !vidRef.current.paused;
    const playOrPause = isPlaying ? "pause" : "play";
    vidRef.current[playOrPause]();
    audioRef.current && audioRef.current[playOrPause]();
  };

  const audioVolume = (() => {
    let volume = 1;
    const _setVolumes = () => {
      vidRef.current.volume = volume;
      if (audioRef.current) audioRef.current.volume = volume;
    };
    const _updateVolume = (increment) => {
      volume = Number((volume + increment).toFixed(1));
    };
    const down = () => {
      if (volume === 0) return;
      _updateVolume(-0.2);
      _setVolumes();
    };
    const up = () => {
      if (volume === 1) return;
      _updateVolume(0.2);
      _setVolumes();
    };
    return {
      down,
      up,
    };
  })();

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
              setIsLoaded(true);
            }}
          >
            <source
              src={currentPost.media.content.videourl}
              type={`video/${currentPost.media.content.format}`}
            />
            Sorry, your browser doesn't support embedded videos.
          </video>
          {currentPost.media.content.audiourl && (
            <audio ref={audioRef} style={{ display: "none" }}>
              <source
                src={currentPost.media.content.audiourl}
                type="audio/mp4"
              />
            </audio>
          )}
          <button id="playpause" onClick={playAndPause}>
            <img src={PlayPause} alt="Play and pause button" />
          </button>
          <div id="volumecontrols">
            <button id="volumeup" onClick={audioVolume.up}>
              <img src={AudioIcon} alt="Audio icon" />
              <p>+</p>
            </button>
            <button id="volumedown" onClick={audioVolume.down}>
              <img src={AudioIcon} alt="Audio icon" />
              <p>-</p>
            </button>
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
