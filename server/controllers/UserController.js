import Razorpay from "razorpay";
import { Webhook } from "svix";
import userModel from "../models/userModel.js";
import transactionModel from "../models/transactionModel.js";

const plans = {
  Basic: { credits: 100, amount: 10 },
  Advanced: { credits: 500, amount: 50 },
  Business: { credits: 5000, amount: 250 },
};

const getRazorpay = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error("Razorpay is not configured");
  }
  return new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });
};

const clerkWebhooks = async (req, res) => {
  try {
    if (!process.env.CLERK_WEBHOOK_SIGNING_SECRET) {
      return res.status(503).json({ success: false, message: "Webhook verification is not configured" });
    }

    const payload = new Webhook(process.env.CLERK_WEBHOOK_SIGNING_SECRET).verify(req.body, {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    });
    const { data, type } = payload;

    if (type === "user.created" || type === "user.updated") {
      await userModel.findOneAndUpdate(
        { clerkId: data.id },
        {
          clerkId: data.id,
          email: data.email_addresses?.[0]?.email_address,
          firstName: data.first_name || "",
          lastName: data.last_name || "",
          photo: data.image_url || "",
        },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      );
    } else if (type === "user.deleted" && data.id) {
      await userModel.findOneAndDelete({ clerkId: data.id });
    }

    return res.json({ success: true });
  } catch (error) {
    console.log("Webhook error:", error.message);
    return res.status(400).json({ success: false, message: "Invalid webhook" });
  }
};

const userCredits = async (req, res) => {
  try {
    const { clerkId } = req.auth;
    const user = await userModel.findOneAndUpdate(
      { clerkId },
      { $setOnInsert: { clerkId, creditBalance: 5, photo: "" } },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );
    return res.json({ success: true, userCredits: user.creditBalance });
  } catch (error) {
    console.log("Credits error:", error.message);
    return res.status(500).json({ success: false, message: "Unable to load credits" });
  }
};

const paymentRazorpay = async (req, res) => {
  try {
    const { clerkId } = req.auth;
    const plan = plans[req.body.planId];
    if (!plan) return res.status(400).json({ success: false, message: "Invalid plan" });

    const user = await userModel.findOne({ clerkId });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const transaction = await transactionModel.create({
      clerkId,
      plan: req.body.planId,
      amount: plan.amount,
      credits: plan.credits,
    });
    const order = await getRazorpay().orders.create({
      amount: plan.amount * 100,
      currency: process.env.CURRENCY || "INR",
      receipt: transaction._id.toString(),
    });
    await transactionModel.findByIdAndUpdate(transaction._id, { razorpayOrderId: order.id });
    return res.json({ success: true, order });
  } catch (error) {
    console.log("Payment creation error:", error.message);
    return res.status(500).json({ success: false, message: "Unable to create payment" });
  }
};

const verifyRazorPay = async (req, res) => {
  try {
    const { razorpay_order_id } = req.body;
    if (!razorpay_order_id) return res.status(400).json({ success: false, message: "Missing Razorpay order id" });

    const order = await getRazorpay().orders.fetch(razorpay_order_id);
    const transaction = await transactionModel.findById(order.receipt);
    if (!transaction || transaction.payment || transaction.clerkId !== req.auth.clerkId || transaction.razorpayOrderId !== order.id) {
      return res.status(400).json({ success: false, message: "Payment verification failed" });
    }
    if (order.status !== "paid") return res.status(400).json({ success: false, message: "Payment is not completed" });

    // Claim the transaction before adding credits so duplicate callbacks cannot
    // credit the same paid order twice.
    const claimedTransaction = await transactionModel.findOneAndUpdate(
      { _id: transaction._id, payment: false },
      { payment: true },
      { new: true },
    );
    if (!claimedTransaction) return res.status(409).json({ success: false, message: "Payment was already processed" });

    const user = await userModel.findOneAndUpdate(
      { clerkId: claimedTransaction.clerkId },
      { $inc: { creditBalance: claimedTransaction.credits } },
      { new: true },
    );
    if (!user) {
      await transactionModel.findByIdAndUpdate(claimedTransaction._id, { payment: false });
      return res.status(404).json({ success: false, message: "User not found" });
    }
    return res.json({ success: true, message: "Credits added", creditBalance: user.creditBalance });
  } catch (error) {
    console.log("Payment verification error:", error.message);
    return res.status(500).json({ success: false, message: "Unable to verify payment" });
  }
};

export { clerkWebhooks, userCredits, paymentRazorpay, verifyRazorPay };
