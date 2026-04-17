import { useClerk, UserButton, useUser } from "@clerk/clerk-react";
import { assets } from "../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { AppContext } from "../context/AppContext";

const Navbar = () => {
  const { openSignIn } = useClerk();
  const { isSignedIn, user } = useUser();
  const { credit, loadCreditsData } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (isSignedIn) loadCreditsData();
  }, [isSignedIn]);

  return (
    <div className="sticky top-0 z-50 backdrop-blur-lg bg-white/70 border-b border-gray-200">
      <div className="flex items-center justify-between px-6 lg:px-32 py-3">

        {/* LOGO */}
        <Link to={"/"} className="flex items-center gap-2">
          <img className="w-32 sm:w-40 hover:scale-105 transition duration-300" src={assets.logo} alt="logo" />
        </Link>

        {/* RIGHT SIDE */}
        {isSignedIn ? (
          <div className="flex items-center gap-4">

            {/* CREDIT BUTTON */}
            <button
              onClick={() => navigate("/buy")}
              className="relative flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white shadow-md hover:scale-105 hover:shadow-lg transition-all duration-300"
            >
              <img className="w-4" src={assets.credit_icon} alt="" />
              <span className="text-sm font-semibold">{credit}</span>

              {/* glow effect */}
              <span className="absolute inset-0 rounded-full bg-white/20 opacity-0 hover:opacity-100 transition duration-300"></span>
            </button>

            {/* USER NAME */}
            <p className="hidden md:block text-gray-700 text-sm font-medium">
              Hi, {user?.firstName}
            </p>

            {/* USER BUTTON */}
            <div className="hover:scale-105 transition duration-300">
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        ) : (
          <button
            onClick={() => openSignIn({})}
            className="flex items-center gap-3 px-6 py-2.5 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300"
          >
            <span className="text-sm font-medium">Get Started</span>
            <img className="w-4" src={assets.arrow_icon} alt="" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;