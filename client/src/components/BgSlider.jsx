import { useState } from "react";
import { assets } from "../assets/assets";

const BgSlider = () => {
  const [sliderPosition, setSliderPosition] = useState(50);

  const handleSliderChange = (e) => {
    setSliderPosition(e.target.value);
  };

  return (
    <div className="relative px-6 lg:px-32 py-20 overflow-hidden">

      {/* BACKGROUND GLOW */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-violet-100 via-white to-fuchsia-100 blur-2xl opacity-70"></div>

      {/* TITLE */}
      <h1 className="text-center text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
        See the Magic in{" "}
        <span className="bg-gradient-to-r from-violet-600 to-fuchsia-500 bg-clip-text text-transparent">
          Action
        </span>
      </h1>

      <p className="text-center text-gray-500 mt-4 max-w-xl mx-auto">
        Instantly remove backgrounds with AI precision. Drag the slider to compare.
      </p>

      {/* SLIDER CONTAINER */}
      <div className="relative w-full max-w-4xl mt-16 mx-auto rounded-2xl overflow-hidden shadow-2xl border border-gray-200">

        {/* BEFORE IMAGE */}
        <img
          src={assets.image_w_bg}
          alt="before"
          className="w-full h-full object-cover"
        />

        {/* AFTER IMAGE */}
        <img
          src={assets.image_wo_bg}
          alt="after"
          className="absolute top-0 left-0 w-full h-full object-cover"
          style={{
            clipPath: `inset(0 0 0 ${sliderPosition}%)`,
          }}
        />

        {/* SLIDER LINE */}
        <div
          className="absolute top-0 bottom-0 w-[2px] bg-white z-20"
          style={{ left: `${sliderPosition}%` }}
        ></div>

        {/* SLIDER HANDLE */}
        <div
          className="absolute top-1/2 z-30 -translate-y-1/2"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 shadow-lg border-4 border-white cursor-pointer">
            <span className="text-white text-xs">↔</span>
          </div>
        </div>

        {/* RANGE INPUT */}
        <input
          type="range"
          min={0}
          max={100}
          value={sliderPosition}
          onChange={handleSliderChange}
          className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer z-40"
        />

        {/* LABELS */}
        <div className="absolute bottom-4 left-4 bg-black/50 text-white text-xs px-3 py-1 rounded-full">
          Before
        </div>
        <div className="absolute bottom-4 right-4 bg-black/50 text-white text-xs px-3 py-1 rounded-full">
          After
        </div>
      </div>
    </div>
  );
};

export default BgSlider;