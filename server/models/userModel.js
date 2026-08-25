import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  clerkId: { type: String, required: true, unique: true },
  email: { type: String, trim: true, lowercase: true, sparse: true },
  photo: { type: String, default: "" },
  firstName: { type: String },
  lastName: { type: String },
  creditBalance: { type: Number, default: 5, min: 0 },
}, { timestamps: true });

const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;
