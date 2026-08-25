import { useContext, useState } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { assets, plans } from "../assets/assets";
import { AppContext } from "../context/AppContext";

const BuyCredit = () => {
  const { backendUrl, loadCreditsData, setCredit } = useContext(AppContext);
  const { getToken } = useAuth();
  const { isSignedIn } = useUser();
  const navigate = useNavigate();
  const [loadingPlan, setLoadingPlan] = useState(null);

  const paymentRazorPay = async (planId) => {
    if (!isSignedIn) return toast.error("Please sign in before purchasing credits");
    if (!window.Razorpay) return toast.error("Payment checkout could not be loaded. Please refresh and try again.");
    setLoadingPlan(planId);
    try {
      const token = await getToken();
      const { data } = await axios.post(`${backendUrl}/api/user/pay-razor`, { planId }, { headers: { Authorization: `Bearer ${token}` } });
      if (!data.success) throw new Error(data.message);

      const payment = new window.Razorpay({
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.order.amount,
        currency: data.order.currency,
        name: "Credits Payment",
        description: "Background-removal credits",
        order_id: data.order.id,
        handler: async (response) => {
          try {
            const verificationToken = await getToken();
            const { data: verification } = await axios.post(`${backendUrl}/api/user/verify-razor`, response, { headers: { Authorization: `Bearer ${verificationToken}` } });
            if (!verification.success) throw new Error(verification.message);
            setCredit(verification.creditBalance);
            await loadCreditsData();
            toast.success("Credits added");
            navigate("/");
          } catch (error) {
            toast.error(error.response?.data?.message || error.message || "Payment verification failed");
          }
        },
        modal: { ondismiss: () => setLoadingPlan(null) },
      });
      payment.open();
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Unable to start payment");
    } finally {
      setLoadingPlan(null);
    }
  };

  return <div className="min-h-[82vh] text-center pt-14 mb-10">
    <button className="border border-gray-400 px-10 py-2 rounded-full mb-6">Our Plans</button>
    <h1 className="text-center text-2xl md:text-3xl lg:text-4xl font-semibold mt-4 bg-gradient-to-r from-gray-900 to-gray-400 bg-clip-text text-transparent mb-8 sm:mb-10">Choose the plan that&apos;s right for you</h1>
    <div className="flex flex-wrap justify-center gap-6 text-left">
      {plans.map((item) => <div className="bg-white drop-shadow-sm border rounded-lg py-12 px-8 text-gray-700 hover:scale-105 transition-all duration-500" key={item.id}>
        <img src={assets.logo_icon} alt="" />
        <p className="mt-3 font-semibold">{item.id}</p><p className="text-sm">{item.desc}</p>
        <p className="mt-6"><span className="text-3xl font-medium">₹{item.price}</span> / {item.credits} credits</p>
        <button onClick={() => paymentRazorPay(item.id)} disabled={loadingPlan !== null} className="w-full text-white text-sm mt-8 bg-gray-800 rounded-md min-w-52 py-2.5 disabled:opacity-50">{loadingPlan === item.id ? "Opening checkout..." : "Get Started"}</button>
      </div>)}
    </div>
  </div>;
};

export default BuyCredit;
