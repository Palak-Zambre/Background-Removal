import "dotenv/config";
import cors from "cors";
import express from "express";
import connectDB from "./configs/mongodb.js";
import userRouter from "./routes/userRoutes.js";
import imageRouter from "./routes/imagesRoutes.js";

const app = express();

const allowedOrigins = (process.env.CLIENT_URL || "")
  .split(",")
  .map((origin) => origin.trim().replace(/\/+$/, ""))
  .filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    // Browser Origin values never end in a slash. Normalize configured values
    // above so CLIENT_URL works whether the Vercel value includes one or not.
    if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`Origin ${origin} is not allowed by CORS`));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// This must run before JSON parsing so Svix receives the exact signed bytes.
app.use("/api/user/webhooks", express.raw({ type: "application/json" }));
app.use(express.json({ limit: "1mb" }));

app.get("/", (_req, res) => res.send("API is working"));
app.use("/api/user", userRouter);
app.use("/api/image", imageRouter);

app.use((err, _req, res, _next) => {
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(413).json({ success: false, message: "Image must be 5MB or smaller" });
  }
  if (err instanceof SyntaxError && "body" in err) {
    return res.status(400).json({ success: false, message: "Invalid JSON body" });
  }
  console.error("Unhandled API error:", err.message);
  return res.status(500).json({ success: false, message: "Internal server error" });
});

export default app;

await connectDB();

if (process.env.VERCEL !== "1") {
  const port = Number(process.env.PORT) || 4000;
  app.listen(port, () => console.log(`API listening on port ${port}`));
}
