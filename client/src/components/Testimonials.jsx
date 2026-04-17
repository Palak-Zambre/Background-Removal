import { testimonialsData } from "../assets/assets";

const Testimonials = () => {
  return (
    <div className="relative px-6 lg:px-32 py-20 overflow-hidden">

      {/* BACKGROUND GLOW */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-violet-100 via-white to-fuchsia-100 blur-2xl opacity-70"></div>

      {/* TITLE */}
      <h1 className="text-center text-3xl md:text-4xl lg:text-5xl font-bold">
        What Our{" "}
        <span className="bg-gradient-to-r from-violet-600 to-fuchsia-500 bg-clip-text text-transparent">
          Users Say
        </span>
      </h1>

      <p className="text-center text-gray-500 mt-4 max-w-xl mx-auto">
        Loved by thousands of users for its speed, accuracy, and simplicity.
      </p>

      {/* CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16 max-w-5xl mx-auto">
        {testimonialsData.map((item, index) => (
          <div
            key={index}
            className="group relative bg-white/70 backdrop-blur-xl border border-gray-200 rounded-2xl p-8 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
          >
            {/* QUOTE */}
            <p className="text-5xl text-violet-300 font-serif leading-none">
              “
            </p>

            {/* TEXT */}
            <p className="text-gray-600 mt-3 text-sm leading-relaxed">
              {item.text}
            </p>

            {/* STARS */}
            <div className="flex gap-1 mt-4">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <span key={i} className="text-yellow-400 text-sm">★</span>
                ))}
            </div>

            {/* USER */}
            <div className="flex items-center gap-3 mt-6">
              <img
                className="w-10 h-10 rounded-full object-cover border"
                src={item.image}
                alt=""
              />
              <div>
                <p className="text-sm font-semibold text-gray-800">
                  {item.author}
                </p>
                <p className="text-xs text-gray-500">
                  {item.jobTitle}
                </p>
              </div>
            </div>

            {/* HOVER GLOW */}
            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonials;