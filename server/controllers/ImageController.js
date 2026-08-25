import axios from "axios";
import FormData from "form-data";
import userModel from "../models/userModel.js";

const removeBgImage = async (req, res) => {
  let reservedCredit = false;

  try {
    const { clerkId } = req.auth;
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Upload an image file up to 5MB" });
    }

    const user = await userModel.findOneAndUpdate(
      { clerkId, creditBalance: { $gt: 0 } },
      { $inc: { creditBalance: -1 } },
      { new: true },
    );

    if (!user) {
      const existingUser = await userModel.findOne({ clerkId });
      return res.status(402).json({
        success: false,
        message: existingUser ? "No credit balance" : "User not found",
        creditBalance: existingUser?.creditBalance ?? 0,
      });
    }
    reservedCredit = true;

    if (!process.env.CLIPDROP_API) throw new Error("CLIPDROP_API is not configured");

    const formData = new FormData();
    formData.append("image_file", req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });

    const { data } = await axios.post("https://clipdrop-api.co/remove-background/v1", formData, {
      headers: { ...formData.getHeaders(), "x-api-key": process.env.CLIPDROP_API },
      responseType: "arraybuffer",
      timeout: 60_000,
    });

    const resultImage = `data:image/png;base64,${Buffer.from(data).toString("base64")}`;
    return res.json({ success: true, resultImage, creditBalance: user.creditBalance, message: "Background removed" });
  } catch (error) {
    if (reservedCredit) {
      await userModel.updateOne({ clerkId: req.auth.clerkId }, { $inc: { creditBalance: 1 } });
    }
    console.log("Image processing error:", error.response?.status || error.message);
    return res.status(502).json({ success: false, message: "Failed to remove the background. Your credit was restored." });
  }
};

export { removeBgImage };
