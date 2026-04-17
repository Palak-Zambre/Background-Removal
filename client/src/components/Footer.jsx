import { assets } from "../assets/assets";

const Footer = () => {
  return (
    <div className="relative mt-20 px-6 lg:px-32 py-12 overflow-hidden">

      {/* BACKGROUND GLOW */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-violet-100 via-white to-fuchsia-100 blur-2xl opacity-70"></div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-8 border-t border-gray-200 pt-8">

        {/* LEFT - LOGO */}
        <div className="flex flex-col items-center md:items-start gap-2">
          <img
            className="w-32 sm:w-40 hover:scale-105 transition duration-300"
            src={assets.logo}
            alt="logo"
          />
          <p className="text-sm text-gray-500 text-center md:text-left">
            AI-powered background removal made simple.
          </p>
        </div>

        {/* CENTER - COPYRIGHT */}
        <p className="text-sm text-gray-500 text-center">
          © 2026 <span className="font-medium text-gray-700">Palak</span>. All rights reserved.
        </p>

        {/* RIGHT - SOCIALS */}
        <div className="flex gap-3">
          {[assets.facebook_icon, assets.twitter_icon, assets.google_plus_icon].map(
            (icon, i) => (
              <div
                key={i}
                className="p-2 rounded-full bg-white shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              >
                <img className="w-5" src={icon} alt="" />
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Footer;