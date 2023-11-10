import "./VideoTimeline.css";
import * as React from "react";
import { useStore } from "@nanostores/react";
import {
  setStart,
  setEnd,
  videoPlayerState,
  setChunkDuration,
  setProgress,
  setChunkProgress,
  setIsPlaying,
} from "../store/VideoPlayerStore";

function controlFromInput(fromSlider, fromInput, toInput, controlSlider) {
  const [from, to] = getParsed(fromInput, toInput);
  fillSlider(fromInput, toInput, "transparent", "#ffd227", controlSlider);
  if (from > to) {
    fromSlider.value = to;
    fromInput.value = to;
  } else {
    fromSlider.value = from;
  }
}

function controlToInput(toSlider, fromInput, toInput, controlSlider) {
  const [from, to] = getParsed(fromInput, toInput);
  fillSlider(fromInput, toInput, "transparent", "#ffd227", controlSlider);
  setToggleAccessible(toInput, toSlider);
  if (from <= to) {
    toSlider.value = to;
    toInput.value = to;
  } else {
    toInput.value = from;
  }
}

function controlFromSlider(fromSlider, toSlider, fromInput) {
  const [from, to] = getParsed(fromSlider, toSlider);
  fillSlider(fromSlider, toSlider, "transparent", "#ffd227", toSlider);
  if (from > to) {
    fromSlider.value = to;
    fromInput.value = to;
  } else {
    fromInput.value = from;
  }
}

function controlToSlider(fromSlider, toSlider, toInput) {
  const [from, to] = getParsed(fromSlider, toSlider);
  fillSlider(fromSlider, toSlider, "transparent", "#ffd227", toSlider);
  setToggleAccessible(toSlider, toSlider);
  if (from <= to) {
    toSlider.value = to;
    toInput.value = to;
  } else {
    toInput.value = from;
    toSlider.value = from;
  }
}

function getParsed(currentFrom, currentTo) {
  const from = parseInt(currentFrom.value, 10);
  const to = parseInt(currentTo.value, 10);
  return [from, to];
}

function fillSlider(from, to, sliderColor, rangeColor, controlSlider) {
  const rangeDistance = to.max - to.min;
  const fromPosition = from.value - to.min;
  const toPosition = to.value - to.min;
  document.documentElement.style.setProperty(
    "--slider-border-background",
    `linear-gradient(
      to right,
      ${sliderColor} 0%,
      ${sliderColor} ${(fromPosition / rangeDistance) * 100}%,
      ${rangeColor} ${(fromPosition / rangeDistance) * 100}%,
      ${rangeColor} ${(toPosition / rangeDistance) * 100}%,
      ${sliderColor} ${(toPosition / rangeDistance) * 100}%,
      ${sliderColor} 100%)`
  );
}

function setToggleAccessible(currentTarget, toSlider) {
  if (Number(currentTarget.value) <= 0) {
    toSlider.style.zIndex = 2;
  } else {
    toSlider.style.zIndex = 0;
  }
}

export default function VideoTimeline() {
  const $videoState = useStore(videoPlayerState);
  const fromSlider = React.useRef(null);
  const toSlider = React.useRef(null);
  const fromInput = React.useRef(null);
  const toInput = React.useRef(null);
  React.useEffect(() => {
    fillSlider(
      fromSlider.current,
      toSlider.current,
      "transparent",
      "#ffd227",
      toSlider.current
    );
    setToggleAccessible(toSlider.current, toSlider.current);
    fromInput.current.oninput = () =>
      controlFromInput(
        fromSlider.current,
        fromInput.current,
        toInput.current,
        toSlider.current
      );
    toInput.current.oninput = () =>
      controlToInput(
        toSlider.current,
        fromInput.current,
        toInput.current,
        toSlider.current
      );

    // trigger crop area marker redraw, otherwise it doesn't have border
    // rendered IDK why on earth
    // shame on me but hey, need to get it done ASAP so will fix later
    setTimeout(() => {
      controlFromSlider(
        fromSlider.current,
        toSlider.current,
        fromInput.current
      );
      controlToSlider(fromSlider.current, toSlider.current, toInput.current);
      setChunkDuration(toSlider.current.value);
    }, 500);
  }, []);

  return (
    <div style={{ display: $videoState.isLoaded ? "block" : "none" }}>
      <div className="range_container">
        <div className="sliders_control">
          <input
            id="fromSlider"
            type="range"
            value={$videoState.start}
            min="0"
            max={$videoState.duration}
            ref={fromSlider}
            onChange={(e) => {
              controlFromSlider(
                fromSlider.current,
                toSlider.current,
                fromInput.current
              );
              setStart(e.target.value);
              setChunkProgress(0);
              setChunkDuration($videoState.end - $videoState.start);
            }}
          />
          <input
            id="toSlider"
            type="range"
            value={$videoState.end}
            min="0"
            max={$videoState.duration}
            ref={toSlider}
            onChange={(e) => {
              controlToSlider(
                fromSlider.current,
                toSlider.current,
                toInput.current
              );
              setEnd(e.target.value);
              if (
                $videoState.chunkProgress > 0 &&
                $videoState.chunkDuration < $videoState.chunkProgress
              ) {
                setChunkProgress($videoState.end - $videoState.start);
                setIsPlaying(false);
              } else {
                setChunkDuration($videoState.end - $videoState.start);
                console.log(
                  "chung end",
                  e.target.value,
                  $videoState.start,
                  $videoState.end
                );
              }
            }}
          />
        </div>
        <div className="form_control">
          <div className="form_control_container">
            <div className="form_control_container__time">Min</div>
            <input
              className="form_control_container__time__input"
              type="number"
              id="fromInput"
              ref={fromInput}
              value={$videoState.start}
              min="0"
              max={$videoState.duration}
            />
          </div>
          <div className="form_control_container">
            <div className="form_control_container__time">Max</div>
            <input
              className="form_control_container__time__input"
              type="number"
              ref={toInput}
              id="toInput"
              value={$videoState.end}
              min="0"
              max={$videoState.duration}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
