import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./configs/mongodb.js";
import useRouter from "./routes/userRoutes.js";
import imageRouter from "./routes/imagesRoutes.js";

// App Config
const PORT = process.env.PORT || 4000;
const app = express();

// Connect DB
await connectDB();

// 🔥 FIX: raw body for webhook ONLY
app.use("/api/user/webhooks", express.raw({ type: "application/json" }));

// Other middlewares
app.use(express.json());
app.use(cors());

// Routes
app.get("/", (req, res) => res.send("API is working"));
app.use("/api/user", useRouter);
app.use("/api/image", imageRouter);

// Start server
app.listen(PORT, () =>
  console.log("Server running on port:", PORT)
);