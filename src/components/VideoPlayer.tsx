import * as React from "react";
import { useStore } from "@nanostores/react";
import {
  videoPlayerState,
  setIsLoaded,
  setDuration,
  setProgress,
  setIsPlaying,
} from "../store/VideoPlayerStore";

const VideoControls = ({ isPlaying, onPlayPauseClick }) => (
  <div className="video-controls">
    {isPlaying ? (
      <button
        type="button"
        className="pause"
        data-testid="pause-test-id"
        onClick={() => onPlayPauseClick(false)}
        aria-label="Pause"
      >
        {"Pause"}
      </button>
    ) : (
      <button
        type="button"
        className="play"
        onClick={() => onPlayPauseClick(true)}
        aria-label="Play"
      >
        {"Play"}
      </button>
    )}
  </div>
);

export default function VideoPlayer() {
  const $videoState = useStore(videoPlayerState);
  console.log($videoState.start);
  console.log($videoState.end);
  const videoSrc = "/big-buck-bunny.mp4";
  const videoRef = React.useRef(null);
  React.useEffect(() => {
    var videoLoadedCheckInterval = setInterval(() => {
      if (videoRef.current.readyState >= 3) {
        console.log("LOADDDED");
        setIsLoaded(true);
        setDuration(videoRef.current.duration);
        clearInterval(videoLoadedCheckInterval);
      }
    }, 500);
  }, []);
  React.useEffect(() => {
    videoRef.current.currentTime = $videoState.start;
  }, [$videoState.start]);

  const intervalRef = React.useRef();
  const startTimer = () => {
    clearInterval(intervalRef.current);
  };
  intervalRef.current = setInterval(() => {
    if (videoRef.current) {
      setProgress(videoRef.current.currentTime);
    }
  }, [1000]);

  React.useEffect(() => {
    console.log($videoState.progress);
  }, [$videoState.progress]);

  React.useEffect(() => {
    // const $videoState = useStore(videoPlayerState);
    if (parseFloat($videoState.progress) >= parseFloat($videoState.end)) {
      console.log(
        parseFloat($videoState.progress),
        parseFloat($videoState.end)
      );
      // videoRef.current.pause();
      setIsPlaying(false);
    }
  }, [$videoState.progress, $videoState.end]);

  React.useEffect(() => {
    if ($videoState.isPlaying) {
      videoRef.current.play();
      setProgress(videoRef.current.currentTime);
      startTimer();
    } else {
      videoRef.current.pause();
    }
  }, [$videoState.isPlaying]);

  return (
    <>
      <h1>{"Video"}</h1>
      {!$videoState.isLoaded && <h2>{"is loading"}</h2>}

      <video
        controls
        preload={"auto"}
        ref={videoRef}
        width={500}
        style={{ display: $videoState.isLoaded ? "block" : "none" }}
      >
        <source src={videoSrc} type="video/mp4" />
      </video>

      <VideoControls
        isPlaying={$videoState.isPlaying}
        onPlayPauseClick={(isPlaying) => {
          setIsPlaying(isPlaying);
        }}
      />

      <button
        onClick={() => {
          console.log($videoState.start);
          console.log($videoState.end);
        }}
      >
        {"CHECK"}
      </button>
    </>
  );
}
