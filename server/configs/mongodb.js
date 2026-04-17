import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("✅ Database Connected");
    });

    mongoose.connection.on("error", (err) => {
      console.log("❌ MongoDB Error:", err);
    });

    await mongoose.connect(process.env.MONGODB_URL);

  } catch (error) {
    console.log("❌ DB Error:", error.message);
  }
};

export default connectDB;