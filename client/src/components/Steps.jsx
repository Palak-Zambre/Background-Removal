import { assets } from "../assets/assets";

const Steps = () => {
  const steps = [
    {
      title: "Upload Image",
      desc: "Select any image from your device and upload it instantly.",
      icon: assets.upload_icon,
    },
    {
      title: "Remove Background",
      desc: "Our AI automatically removes the background in seconds.",
      icon: assets.remove_bg_icon,
    },
    {
      title: "Download Image",
      desc: "Download your transparent image in high quality.",
      icon: assets.download_icon,
    },
  ];

  return (
    <div className="relative px-6 lg:px-32 py-20 lg:py-32 overflow-hidden">

      {/* BACKGROUND GLOW */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-violet-100 via-white to-fuchsia-100 blur-2xl opacity-70"></div>

      {/* TITLE */}
      <h1 className="text-center text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
        Remove Background in{" "}
        <span className="bg-gradient-to-r from-violet-600 to-fuchsia-500 bg-clip-text text-transparent">
          3 Simple Steps
        </span>
      </h1>

      {/* STEPS */}
      <div className="relative mt-20 grid md:grid-cols-3 gap-8">

        {steps.map((step, index) => (
          <div
            key={index}
            className="group relative bg-white/70 backdrop-blur-xl border border-gray-200 rounded-2xl p-8 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
          >
            {/* STEP NUMBER */}
            <div className="absolute -top-5 left-6 w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white font-bold shadow-md">
              {index + 1}
            </div>

            {/* ICON */}
            <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-gradient-to-r from-violet-600/10 to-fuchsia-500/10 mb-5">
              <img src={step.icon} alt="" className="w-7" />
            </div>

            {/* CONTENT */}
            <h3 className="text-lg font-semibold text-gray-800">
              {step.title}
            </h3>

            <p className="text-sm text-gray-500 mt-2 leading-relaxed">
              {step.desc}
            </p>

            {/* HOVER GLOW */}
            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Steps;