import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./configs/mongodb.js";
import useRouter from "./routes/userRoutes.js";
import imageRouter from "./routes/imagesRoutes.js";

const app = express();
const PORT = process.env.PORT || 4000;

// ================== 🔥 CONNECT DB SAFELY ==================
const startServer = async () => {
  try {
    await connectDB();
    console.log("✅ Database Connected");

    // ================== 🔥 IMPORTANT MIDDLEWARE ORDER ==================

    // ✅ 1. CORS (FIXED)
    app.use(
      cors({
        origin: "*", // allow all (you can restrict later)
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
      })
    );

    // ✅ VERY IMPORTANT (fix preflight error)
    app.options("*", cors());

    // ✅ 2. Webhook route (RAW)
    app.use("/api/user/webhooks", express.raw({ type: "application/json" }));

    // ✅ 3. JSON parser
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

    // ================== START SERVER ==================
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port: ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
  }
};

startServer();