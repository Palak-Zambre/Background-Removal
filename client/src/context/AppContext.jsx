import { useAuth, useClerk, useUser } from "@clerk/clerk-react";
import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const [credit, setCredit] = useState(0);
  const [image, setImage] = useState(false);
  const [resultImage, setResultImage] = useState(false);

  const backendUrl = import.meta.env.VITE_BACKEND_URI;
  const navigate = useNavigate();

  const { getToken } = useAuth();
  const { isSignedIn } = useUser();
  const { openSignIn } = useClerk();

  // ================= LOAD CREDITS =================
  const loadCreditsData = async () => {
    try {
      const token = await getToken();

      if (!token) {
        toast.error("Authentication token not found");
        return;
      }

      const response = await axios.get(
        backendUrl + "/api/user/credits",
        {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ FIXED
          },
        }
      );

      console.log("Credits response:", response.data);

      if (response.data.success) {
        setCredit(response.data.userCredits);
      } else {
        setCredit(0);
        toast.warning(response.data.message);
      }
    } catch (error) {
      console.error("Credits error:", error);
      setCredit(0);
      toast.error("Failed to load credits");
    }
  };

  // ================= AUTO LOAD =================
  useEffect(() => {
    if (isSignedIn) {
      loadCreditsData();
    }
  }, [isSignedIn]);

  // ================= REMOVE BG =================
  const removeBg = async (image) => {
    try {
      if (!isSignedIn) {
        return openSignIn();
      }

      setImage(image);
      setResultImage(false);
      navigate("/result");

      const token = await getToken();

      const formData = new FormData();
      image && formData.append("image", image);

      const { data } = await axios.post(
        backendUrl + "/api/image/remove-bg",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ FIXED
          },
        }
      );

      if (data.success) {
        setResultImage(data.resultImage);
        data.creditBalance && setCredit(data.creditBalance);
      } else {
        toast.error(data.message);
        data.creditBalance && setCredit(data.creditBalance);

        if (data.creditBalance === 0) {
          navigate("/buy");
        }
      }
    } catch (error) {
      console.log("error:", error);
      toast.error(error.message);
    }
  };

  const value = {
    credit,
    setCredit,
    loadCreditsData,
    backendUrl,
    image,
    setImage,
    removeBg,
    resultImage,
    setResultImage,
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;