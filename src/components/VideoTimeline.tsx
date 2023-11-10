import "./VideoTimeline.css";
import * as React from "react";
import { setStart, setEnd } from "../store/VideoPlayerStore";

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
  setToggleAccessible(toInput);
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
  setToggleAccessible(toSlider);
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

function setToggleAccessible(currentTarget) {
  const toSlider = document.querySelector("#toSlider");
  if (Number(currentTarget.value) <= 0) {
    toSlider.style.zIndex = 2;
  } else {
    toSlider.style.zIndex = 0;
  }
}

export default function VideoTimeline() {
  // const fromSlider = document.querySelector("#fromSlider");
  // const toSlider = document.querySelector("#toSlider");
  // const fromInput = document.querySelector("#fromInput");
  // const toInput = document.querySelector("#toInput");
  // fillSlider(fromSlider, toSlider, "transparent", "#ffd227", toSlider);
  // setToggleAccessible(toSlider);
  //
  // fromSlider.oninput = () => controlFromSlider(fromSlider, toSlider, fromInput);
  // toSlider.oninput = () => controlToSlider(fromSlider, toSlider, toInput);
  // fromInput.oninput = () =>
  //   controlFromInput(fromSlider, fromInput, toInput, toSlider);
  // toInput.oninput = () =>
  //   controlToInput(toSlider, fromInput, toInput, toSlider);

  return (
    <div>
      <div className="range_container">
        <div className="sliders_control">
          <input id="fromSlider" type="range" value="10" min="0" max="100" />
          <input id="toSlider" type="range" value="30" min="0" max="100" />
        </div>
        <div className="form_control">
          <div className="form_control_container">
            <div className="form_control_container__time">Min</div>
            <input
              className="form_control_container__time__input"
              type="number"
              id="fromInput"
              value="10"
              min="0"
              max="100"
            />
          </div>
          <div className="form_control_container">
            <div className="form_control_container__time">Max</div>
            <input
              className="form_control_container__time__input"
              type="number"
              id="toInput"
              value="30"
              min="0"
              max="100"
            />
          </div>
        </div>
      </div>
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
