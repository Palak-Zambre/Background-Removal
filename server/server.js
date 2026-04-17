import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./configs/mongodb.js";
import useRouter from "./routes/userRoutes.js";
import imageRouter from "./routes/imagesRoutes.js";

const app = express();
const PORT = process.env.PORT || 4000;

// ✅ Connect DB
await connectDB();

// ================== 🔥 IMPORTANT MIDDLEWARE ORDER ==================

// 1️⃣ Webhook route MUST be raw
app.use("/api/user/webhooks", express.raw({ type: "application/json" }));

// 2️⃣ Then JSON parser
app.use(express.json());

// 3️⃣ Then other middlewares
app.use(cors());

// ================== ROUTES ==================

app.get("/", (req, res) => res.send("API is working"));

app.use("/api/user", useRouter);
app.use("/api/image", imageRouter);

// ================== SERVER ==================

app.listen(PORT, () => {
  console.log("🚀 Server running on port:", PORT);
});