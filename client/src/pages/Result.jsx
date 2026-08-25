import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Result = () => {
  const { resultImage, image, setImage, setResultImage } = useContext(AppContext);
  const navigate = useNavigate();

  const tryAnotherImage = () => {
    setImage(null);
    setResultImage(null);
    navigate("/");
  };

  return (
    <div className="mx-auto my-10 w-[min(92%,1200px)] min-h-[72vh]">
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_20px_70px_-30px_rgba(76,29,149,0.35)] sm:p-8">
        <div className="mb-8 flex flex-col gap-2 border-b border-slate-100 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-600">Your result</p>
            <h1 className="mt-1 text-2xl font-bold text-slate-800 sm:text-3xl">Background removed beautifully</h1>
          </div>
          {resultImage && <span className="w-fit rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">Ready to download</span>}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-3">
            <p className="mb-3 text-sm font-semibold text-slate-600">Original image</p>
            <img
              className="h-[280px] w-full rounded-xl object-contain sm:h-[360px]"
              src={image ? URL.createObjectURL(image) : ""}
              alt="Original upload"
            />
          </div>

          <div className="overflow-hidden rounded-2xl border border-violet-100 bg-violet-50/40 p-3">
            <p className="mb-3 text-sm font-semibold text-violet-700">Background removed</p>
            <div className="relative h-[280px] overflow-hidden rounded-xl bg-layer sm:h-[360px]">
              <img className="h-full w-full object-contain" src={resultImage || ""} alt="Background removed result" />
              {!resultImage && image && (
                <div className="absolute right-1/2 bottom-1/2 transform translate-x-1/2 translate-y-1/2">
                  <div className="h-12 w-12 animate-spin rounded-full border-4 border-violet-600 border-t-transparent" />
                </div>
              )}
            </div>
          </div>
        </div>

        {resultImage && (
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3 sm:justify-end">
            <button
              onClick={tryAnotherImage}
              className="px-8 py-2.5 text-violet-600 text-sm border border-violet-600 rounded-full hover:scale-105 transition-all duration-700"
            >
              Try another image
            </button>
            <a
              href={resultImage}
              download
              className="cursor-pointer rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 px-8 py-2.5 text-sm font-medium text-white shadow-lg shadow-violet-200 transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              Download image
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Result;
