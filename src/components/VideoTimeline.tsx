import { setStart, setEnd } from "../store/VideoPlayerStore";

export default function VideoTimeline() {
  return (
    <div>
      <button
        onClick={() => {
          setStart(40);
          console.log("setting start to 40");
        }}
      >
        {"START"}
      </button>
      <button
        onClick={() => {
          setEnd(80);
        }}
      >
        {"END"}
      </button>
    </div>
  );
}
