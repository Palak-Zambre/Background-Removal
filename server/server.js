import "dotenv/config";
import express from "express";
import connectDB from "./configs/mongodb.js";
import useRouter from "./routes/userRoutes.js";
import imageRouter from "./routes/imagesRoutes.js";

const app = express();

// ================== CONNECT DB ==================
await connectDB();
console.log("✅ Database Connected");

// ================== CORS FIX ==================
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );

  // 🔥 HANDLE PREFLIGHT
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  next();
});

// ================== MIDDLEWARE ==================
app.use("/api/user/webhooks", express.raw({ type: "application/json" }));
app.use(express.json());

// ================== ROUTES ==================
app.get("/", (req, res) => res.send("API is working 🚀"));

app.use("/api/user", useRouter);
app.use("/api/image", imageRouter);

// ================== ERROR HANDLER ==================
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);
  res.status(500).json({
    success: false,
    message: err.message,
  });
});

// ================== EXPORT FOR VERCEL ==================
export default app;