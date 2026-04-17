import axios from "axios";
import fs from "fs";
import FormData from "form-data";
import userModel from "../models/userModel.js";

const removeBgImage = async (req, res) => {
  try {
    const { clerkId } = req.body;

    // 🔍 Find user
    const user = await userModel.findOne({ clerkId });
    if (!user) {
      return res.json({ success: false, message: "User Not Found" });
    }

    // 🔍 Check credits
    if (user.creditBalance <= 0) {
      return res.json({
        success: false,
        message: "No Credit Balance",
        creditBalance: user.creditBalance,
      });
    }

    // 🔍 Check file
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const imagePath = req.file.path;

    const formData = new FormData();
    formData.append("image_file", fs.createReadStream(imagePath));

    // 🔥 Clipdrop API call
    const { data } = await axios.post(
      "https://clipdrop-api.co/remove-background/v1",
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          "x-api-key": process.env.CLIPDROP_API, // ✅ matches your .env
        },
        responseType: "arraybuffer",
      }
    );

    // 🔄 Convert to base64
    const base64Image = Buffer.from(data, "binary").toString("base64");
    const resultImage = `data:${req.file.mimetype};base64,${base64Image}`;

    // ✅ SAFE CREDIT UPDATE (FIXED)
    const updatedUser = await userModel.findByIdAndUpdate(
      user._id,
      { $inc: { creditBalance: -1 } },
      { new: true }
    );

    // 🧹 Delete temp file (IMPORTANT for Vercel)
    fs.unlinkSync(imagePath);

    // ✅ Response
    res.json({
      success: true,
      resultImage,
      creditBalance: updatedUser.creditBalance,
      message: "Background Removed",
    });

  } catch (error) {
    if (error.response) {
      console.log("Response data:", error.response.data);
      console.log("Response status:", error.response.status);
    }
    console.log("Error message:", error.message);

    res.json({
      success: false,
      message: "Failed to remove background",
    });
  }
};

export { removeBgImage };