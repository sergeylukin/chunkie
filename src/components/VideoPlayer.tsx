import { useStore } from "@nanostores/react";
import { videoPlayerState } from "../store/VideoPlayerStore";

export default function VideoPlayer() {
  const $videoState = useStore(videoPlayerState);
  console.log($videoState.start);
  console.log($videoState.end);
  return (
    <>
      <h1>{"Video"}</h1>
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
