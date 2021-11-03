import { useContext, useRef, useState, useEffect } from "react";

// styles
import "../../styles/Video.min.css";

// context
import { RedditPostContext } from "../../constants/contexts";

// images
import PlayPause from "../../images/playpause.png";
import AudioIcon from "../../images/audio-icon.png";

// components
import Loading from "../Loading";
import Prompt from "../Prompt";

const Video = () => {
  // state
  const [hasAudio, setHasAudio] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  // context
  const { currentPost } = useContext(RedditPostContext);

  // refs
  const vidRef = useRef();
  const audioRef = useRef();

  // state management
  // reset state on post change
  useEffect(() => {
    currentPost.media.local ? setIsLoaded(false) : setIsLoaded(true);
    setFailed(false);
    setHasAudio(true);
  }, [currentPost]);

  // media controls avoid state management for fewer renders
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

  if (failed)
    return <Prompt type="contentError" confirm={() => setFailed(false)} />;

  return (
    <div className="mediacontainer">
      {isLoaded || <Loading type="VIDEO" />}
      {!!currentPost.media.local ? (
        <>
          <video
            ref={vidRef}
            className="video"
            style={{ display: isLoaded ? undefined : "none" }}
            onLoadedData={() => setIsLoaded(true)}
            onError={() => setFailed(true)}
          >
            <source
              src={currentPost.media.content.videourl}
              type={`video/${currentPost.media.content.format}`}
            />
            Sorry, your browser doesn't support embedded videos.
          </video>
          {/* 
            The below solution is far from perfect:

            Basically, as referenced here:
            https://www.reddit.com/r/redditdev/comments/ihgmv5/getting_audio_from_reddit_video/
            Reddit now serves its hosted video as two separate files, one
            video only and one audio. The solution in a production-quality
            app would be some server-side operation downloading both files
            and encoding them together before serving, but my current
            front-end solution is to try to download the audio file in an
            invisible audio component with both video and audio controlled
            by the same buttons, the audio element disappearing if the GET
            throws an error(!) (Yes, the thrown error is visible in the
            console).

            This is also why video controls are disabled, as scrubbing through
            the video would completely desynchronise the audio... ;)

            I've checked the endpoint and there's no 'is_gif'-like flag, as
            some posts are literally silent mp4 videos (the video has enabled
            audio controls but no actual sound).

            Sorry!
          */}
          {currentPost.media.content.audiourl && hasAudio && (
            <audio
              ref={audioRef}
              style={{ display: "none" }}
              onError={() => setHasAudio(false)}
            >
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
          dangerouslySetInnerHTML={{
            __html: currentPost.media.content.html,
          }}
          style={{ display: isLoaded ? undefined : "none" }}
        />
      )}
    </div>
  );
};

export default Video;
