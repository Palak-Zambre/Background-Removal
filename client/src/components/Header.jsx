import { useContext } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import { UploadCloud } from "lucide-react";

export default function Header() {
  const { removeBg } = useContext(AppContext);

  return (
    <div className="relative overflow-hidden px-6 sm:px-12 lg:px-32 py-16">
      {/* Background Glow */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-violet-100 via-white to-fuchsia-100 blur-2xl opacity-70" />

      <div className="grid lg:grid-cols-2 gap-12 items-center">
        {/* LEFT */}
        <div className="space-y-8">
          <div className="inline-block px-4 py-1 text-xs font-semibold rounded-full bg-violet-100 text-violet-700">
            ✨ AI Powered Tool
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight">
            Remove the
            <span className="block bg-gradient-to-r from-violet-600 to-fuchsia-500 bg-clip-text text-transparent">
              Background
            </span>
            in Seconds 🚀
          </h1>

          <p className="text-gray-500 max-w-lg text-base leading-relaxed">
            Instantly remove backgrounds from your images with cutting-edge AI.
            Fast, accurate, and completely free. No design skills needed.
          </p>

          {/* Upload Box */}
          <div className="relative group">
            <input
              onChange={(e) => removeBg(e.target.files[0])}
              type="file"
              accept="image/*"
              id="upload1"
              hidden
            />

            <label
              htmlFor="upload1"
              className="flex items-center justify-between gap-4 px-6 py-4 rounded-2xl cursor-pointer bg-white shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02]"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white">
                  <UploadCloud size={20} />
                </div>
                <div>
                  <p className="font-semibold text-gray-700">Upload Image</p>
                  <p className="text-xs text-gray-400">PNG, JPG up to 5MB</p>
                </div>
              </div>
              <span className="text-sm text-violet-600 font-medium">Browse</span>
            </label>
          </div>

          {/* Features */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <span className="bg-gray-100 px-3 py-1 rounded-full">⚡ Fast</span>
            <span className="bg-gray-100 px-3 py-1 rounded-full">🎯 Accurate</span>
            <span className="bg-gray-100 px-3 py-1 rounded-full">🆓 Free</span>
          </div>
        </div>

        {/* RIGHT */}
        <div className="relative flex justify-center">
          <div className="absolute -inset-6 bg-gradient-to-r from-violet-500 to-fuchsia-500 blur-3xl opacity-20 rounded-full" />

          <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-gray-200 bg-white">
            <img
              src={assets.header_img}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}