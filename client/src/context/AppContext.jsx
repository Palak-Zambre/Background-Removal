import { useAuth, useClerk, useUser } from "@clerk/clerk-react";
import axios from "axios";
import PropTypes from "prop-types";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AppContext } from "./AppContext";

const backendUrl = (import.meta.env.VITE_BACKEND_URI || "http://localhost:4000").replace(/\/$/, "");
const maxImageSize = 5 * 1024 * 1024;

const AppContextProvider = ({ children }) => {
  const [credit, setCredit] = useState(0);
  const [image, setImage] = useState(null);
  const [resultImage, setResultImage] = useState(null);
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const { isSignedIn } = useUser();
  const { openSignIn } = useClerk();

  const loadCreditsData = useCallback(async () => {
    if (!isSignedIn) return;
    try {
      const token = await getToken();
      const { data } = await axios.get(`${backendUrl}/api/user/credits`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) setCredit(data.userCredits);
      else toast.error(data.message || "Failed to load credits");
    } catch (error) {
      setCredit(0);
      toast.error(error.response?.data?.message || "Failed to load credits");
    }
  }, [getToken, isSignedIn]);

  useEffect(() => { loadCreditsData(); }, [loadCreditsData]);

  const removeBg = async (file) => {
    if (!isSignedIn) return openSignIn();
    if (!file || !file.type.startsWith("image/")) return toast.error("Please choose an image file");
    if (file.size > maxImageSize) return toast.error("Image must be 5MB or smaller");

    setImage(file);
    setResultImage(null);
    navigate("/result");
    try {
      const token = await getToken();
      const formData = new FormData();
      formData.append("image", file);
      const { data } = await axios.post(`${backendUrl}/api/image/remove-bg`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setResultImage(data.resultImage);
        setCredit(data.creditBalance);
      } else {
        if (data.creditBalance !== undefined) setCredit(data.creditBalance);
        toast.error(data.message || "Unable to remove the background");
        if (data.creditBalance === 0) navigate("/buy");
      }
    } catch (error) {
      const data = error.response?.data;
      if (data?.creditBalance !== undefined) setCredit(data.creditBalance);
      toast.error(data?.message || "Unable to remove the background");
      if (data?.creditBalance === 0) navigate("/buy");
    }
  };

  return <AppContext.Provider value={{ credit, setCredit, loadCreditsData, backendUrl, image, setImage, removeBg, resultImage, setResultImage }}>{children}</AppContext.Provider>;
};

AppContextProvider.propTypes = { children: PropTypes.node.isRequired };
export default AppContextProvider;
