import * as React from "react";
import { useStore } from "@nanostores/react";
import {
  videoPlayerState,
  setIsLoaded,
  setDuration,
  setProgress,
  setChunkProgress,
  setIsPlaying,
} from "../store/VideoPlayerStore";

const VideoControls = ({
  isPlaying,
  duration,
  currentTime,
  onPlayPauseClick,
}) => (
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
    {formatTime(currentTime)} {formatTime(duration)}
  </div>
);

function formatTime(time) {
  if (!time) return "00:00";
  const mydate = new Date(time * 1000);
  const hours = mydate.getUTCHours();
  const minutes = pad(mydate.getUTCMinutes());
  const seconds = pad(mydate.getUTCSeconds());
  let humandate = "";
  if (hours) humandate += `${hours}:`;
  humandate += minutes + ":" + seconds;
  return humandate;
}
function pad(n) {
  return n < 10 ? "0" + n : n;
}

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
    setProgress(videoRef.current.currentTime);
    setChunkProgress(0);
  }, [$videoState.start]);

  const intervalRef = React.useRef();
  const startTimer = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      if (videoRef.current) {
        setProgress(videoRef.current.currentTime);
        setChunkProgress(
          Math.floor(videoRef.current.currentTime) - $videoState.start
        );
      }
    }, [1000]);
  };

  React.useEffect(() => {
    console.log($videoState.progress);
  }, [$videoState.progress]);

  React.useEffect(() => {
    // const $videoState = useStore(videoPlayerState);
    if (
      Math.floor(parseFloat($videoState.progress)) >=
      parseFloat($videoState.end)
    ) {
      console.log(
        parseFloat($videoState.progress),
        parseFloat($videoState.end)
      );
      // Shameful hack that aligns current position with total duration to
      // avoid incosistency)
      setChunkProgress($videoState.chunkDuration);
      clearInterval(intervalRef.current);
      setIsPlaying(false);
    }
  }, [$videoState.progress, $videoState.end]);

  React.useEffect(() => {
    if ($videoState.isPlaying) {
      videoRef.current.play();
      setProgress(videoRef.current.currentTime);
      setChunkProgress(
        Math.floor(parseFloat(videoRef.current.currentTime) - $videoState.start)
      );
      startTimer();
    } else {
      clearInterval(intervalRef.current);
      videoRef.current.pause();
    }
  }, [$videoState.isPlaying, $videoState.start]);

  return (
    <>
      <h1>{"Video"}</h1>
      {!$videoState.isLoaded && <h2>{"is loading"}</h2>}

      <video
        controls={false}
        preload={"auto"}
        ref={videoRef}
        width={500}
        style={{ display: $videoState.isLoaded ? "block" : "none" }}
      >
        <source src={videoSrc} type="video/mp4" />
      </video>

      <VideoControls
        duration={$videoState.chunkDuration}
        currentTime={$videoState.chunkProgress}
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
