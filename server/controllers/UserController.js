import userModel from "../models/userModel.js";
import transactionModel from "../models/transactionModel.js";
import Razorpay from "razorpay";

// ================== CLERK WEBHOOK ==================
const clerkWebhooks = async (req, res) => {
  try {
    const payload = JSON.parse(req.body.toString());

    const { data, type } = payload;

    console.log("📩 Webhook received:", type);

    switch (type) {
      // ✅ USER CREATED
      case "user.created": {
        const userData = {
          clerkId: data.id,
          email: data.email_addresses?.[0]?.email_address || "",
          firstName: data.first_name,
          lastName: data.last_name,
          photo: data.image_url,
          creditBalance: 5,
        };

        // 🔥 prevent duplicate error
        const existingUser = await userModel.findOne({
          clerkId: data.id,
        });

        if (!existingUser) {
          await userModel.create(userData);
          console.log("✅ User created in DB");
        } else {
          console.log("⚡ User already exists");
        }

        res.json({ success: true });
        break;
      }

      // ✅ USER UPDATED
      case "user.updated": {
        const userData = {
          email: data.email_addresses?.[0]?.email_address || "",
          firstName: data.first_name,
          lastName: data.last_name,
          photo: data.image_url,
        };

        await userModel.findOneAndUpdate(
          { clerkId: data.id },
          userData
        );

        console.log("🔄 User updated");

        res.json({ success: true });
        break;
      }

      // ✅ USER DELETED
      case "user.deleted": {
        await userModel.findOneAndDelete({ clerkId: data.id });

        console.log("🗑 User deleted");

        res.json({ success: true });
        break;
      }

      default:
        res.json({ success: true });
        break;
    }
  } catch (error) {
    console.log("❌ WEBHOOK ERROR:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ================== GET USER CREDITS ==================
const userCredits = async (req, res) => {
  try {
    const { clerkId } = req.body;

    const userData = await userModel.findOne({ clerkId });

    if (!userData) {
      return res.json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      userCredits: userData.creditBalance,
    });
  } catch (error) {
    console.log("❌ ERROR:", error.message);
    res.json({ success: false, message: error.message });
  }
};

// ================== RAZORPAY ==================
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ================== CREATE PAYMENT ==================
const paymentRazorpay = async (req, res) => {
  try {
    const { clerkId, planId } = req.body;

    const userData = await userModel.findOne({ clerkId });

    if (!userData || !planId) {
      return res.json({ success: false, message: "Invalid Credentials" });
    }

    let credits, plan, amount;

    switch (planId) {
      case "Basic":
        plan = "Basic";
        credits = 100;
        amount = 10;
        break;

      case "Advanced":
        plan = "Advanced";
        credits = 500;
        amount = 50;
        break;

      case "Business":
        plan = "Business";
        credits = 5000;
        amount = 250;
        break;

      default:
        return res.json({ success: false, message: "Invalid Plan" });
    }

    const date = Date.now();

    const transactionData = {
      clerkId,
      plan,
      amount,
      credits,
      date,
      payment: false,
    };

    const newTransaction = await transactionModel.create(transactionData);

    const options = {
      amount: amount * 100,
      currency: process.env.CURRENCY,
      receipt: newTransaction._id.toString(),
    };

    razorpayInstance.orders.create(options, (error, order) => {
      if (error) {
        return res.json({ success: false, message: error });
      }
      res.json({ success: true, order });
    });
  } catch (error) {
    console.log("❌ ERROR:", error.message);
    res.json({ success: false, message: error.message });
  }
};

// ================== VERIFY PAYMENT ==================
const verifyRazorPay = async (req, res) => {
  try {
    const { razorpay_order_id } = req.body;

    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);

    if (orderInfo.status === "paid") {
      const transactionData = await transactionModel.findById(
        orderInfo.receipt
      );

      if (!transactionData || transactionData.payment) {
        return res.json({ success: false, message: "Payment Failed" });
      }

      const userData = await userModel.findOne({
        clerkId: transactionData.clerkId,
      });

      const updatedCredits =
        userData.creditBalance + transactionData.credits;

      await userModel.findByIdAndUpdate(userData._id, {
        creditBalance: updatedCredits,
      });

      await transactionModel.findByIdAndUpdate(transactionData._id, {
        payment: true,
      });

      res.json({ success: true, message: "Credits Added" });
    } else {
      res.json({ success: false, message: "Payment not completed" });
    }
  } catch (error) {
    console.log("❌ ERROR:", error.message);
    res.json({ success: false, message: error.message });
  }
};

export {
  clerkWebhooks,
  userCredits,
  paymentRazorpay,
  verifyRazorPay,
};