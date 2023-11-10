import { atom, map } from "nanostores";

export const videoStart = atom(0);

export type VideoPlayerState = {
  start: number;
  end: number;
};

export const videoPlayerState = map<VideoPlayerState>({ start: 0, end: 100 });

type VideoPlayerDisplayInfo = Pick<VideoPlayerState, "start" | "end">;
export function setStart(start: number) {
  videoPlayerState.setKey("start", start);
}
export function setEnd(end: number) {
  videoPlayerState.setKey("end", end);
}
