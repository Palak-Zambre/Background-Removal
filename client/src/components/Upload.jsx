import { useContext } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";

const Upload = () => {
  const { removeBg } = useContext(AppContext);

  return (
    <div className="relative px-6 lg:px-32 py-20 overflow-hidden">

      {/* BACKGROUND GLOW */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-violet-100 via-white to-fuchsia-100 blur-2xl opacity-70"></div>

      {/* TITLE */}
      <h1 className="text-center text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
        See the Magic.{" "}
        <span className="bg-gradient-to-r from-violet-600 to-fuchsia-500 bg-clip-text text-transparent">
          Try it Now
        </span>
      </h1>

      <p className="text-center text-gray-500 mt-4 max-w-xl mx-auto">
        Upload your image and let our AI instantly remove the background with precision.
      </p>

      {/* UPLOAD BOX */}
      <div className="mt-16 flex justify-center">
        <div className="relative group w-full max-w-xl">

          <input
            onChange={(e) => removeBg(e.target.files[0])}
            type="file"
            accept="image/*"
            id="upload2"
            hidden
          />

          <label
            htmlFor="upload2"
            className="flex flex-col items-center justify-center gap-4 px-10 py-12 rounded-2xl cursor-pointer bg-white/70 backdrop-blur-xl border-2 border-dashed border-gray-300 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
          >
            {/* ICON */}
            <div className="p-4 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500">
              <img className="w-6" src={assets.upload_btn_icon} alt="" />
            </div>

            {/* TEXT */}
            <p className="text-lg font-semibold text-gray-700">
              Click to upload or drag & drop
            </p>

            <p className="text-sm text-gray-500">
              PNG, JPG, JPEG (Max 5MB)
            </p>
          </label>

          {/* HOVER GLOW */}
          <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10"></div>
        </div>
      </div>
    </div>
  );
};

export default Upload;
