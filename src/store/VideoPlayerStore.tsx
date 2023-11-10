import { atom, map } from "nanostores";

export const videoStart = atom(0);

export type VideoPlayerState = {
  isLoaded: boolean;
  start: number;
  end: number;
  duration: number;
  chunkDuration: number;
  chunkProgress: number;
  progress: number;
  isPlaying: boolean;
  isMute: boolean;
};

export const videoPlayerState = map<VideoPlayerState>({
  start: 132,
  end: 400,
  isLoaded: false,
  duration: 0,
  chunkDuration: 0,
  chunkProgress: 0,
  progress: 0,
  isPlaying: false,
  isMute: false,
});

type VideoPlayerDisplayInfo = Pick<VideoPlayerState, "start" | "end">;
export function setStart(start: number) {
  videoPlayerState.setKey("start", start);
}
export function setEnd(end: number) {
  videoPlayerState.setKey("end", end);
}
export function setIsLoaded(isLoaded: boolean) {
  videoPlayerState.setKey("isLoaded", isLoaded);
}
export function setDuration(duration: number) {
  videoPlayerState.setKey("duration", duration);
}
export function setProgress(progress: number) {
  videoPlayerState.setKey("progress", progress);
}
export function setIsPlaying(isPlaying: boolean) {
  videoPlayerState.setKey("isPlaying", isPlaying);
}
export function setChunkDuration(duration: number) {
  videoPlayerState.setKey("chunkDuration", duration);
}
export function setChunkProgress(duration: number) {
  videoPlayerState.setKey("chunkProgress", duration);
}
export function setIsMute(isMute: boolean) {
  videoPlayerState.setKey("isMute", isMute);
}
