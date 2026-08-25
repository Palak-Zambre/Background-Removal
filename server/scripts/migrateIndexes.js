import "dotenv/config";
import mongoose from "mongoose";
import userModel from "../models/userModel.js";
import transactionModel from "../models/transactionModel.js";

if (!process.env.MONGODB_URL) throw new Error("MONGODB_URL is not configured");

await mongoose.connect(process.env.MONGODB_URL);
await userModel.syncIndexes();
await transactionModel.syncIndexes();
await mongoose.disconnect();

console.log("Database indexes migrated successfully");
