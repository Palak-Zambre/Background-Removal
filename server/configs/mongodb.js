import mongoose from "mongoose";

const connectDB = async () => {
  if (!process.env.MONGODB_URL) throw new Error("MONGODB_URL is not configured");
  await mongoose.connect(process.env.MONGODB_URL);
  console.log("Database connected");
};

export default connectDB;
