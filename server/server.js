import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./configs/mongodb.js";
import useRouter from "./routes/userRoutes.js";
import imageRouter from "./routes/imagesRoutes.js";

const app = express();
const PORT = process.env.PORT || 4000;

// ================== 🔥 START SERVER ==================
const startServer = async () => {
  try {
    await connectDB();
    console.log("✅ Database Connected");

    // ================== 🔥 CORS FIX (VERCEL SAFE) ==================
    app.use((req, res, next) => {
      res.header("Access-Control-Allow-Origin", "*");
      res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization, token"
      );
      res.header(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, OPTIONS"
      );

      // ✅ HANDLE PREFLIGHT (MOST IMPORTANT FIX)
      if (req.method === "OPTIONS") {
        return res.sendStatus(200);
      }

      next();
    });

    // ================== 🔥 MIDDLEWARE ORDER ==================

    // 1️⃣ Clerk webhook (RAW BODY)
    app.use("/api/user/webhooks", express.raw({ type: "application/json" }));

    // 2️⃣ JSON parser
    app.use(express.json());

    // ================== ROUTES ==================

    app.get("/", (req, res) => res.send("API is working 🚀"));

    app.use("/api/user", useRouter);
    app.use("/api/image", imageRouter);

    // ================== ERROR HANDLER ==================
    app.use((err, req, res, next) => {
      console.error("❌ Global Error:", err.message);
      res.status(500).json({ success: false, message: err.message });
    });

    // ================== START ==================
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port: ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
  }
};

startServer();