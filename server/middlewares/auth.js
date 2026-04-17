import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
  try {
    let token = req.headers.token;

    // 🔥 Support Bearer token
    if (!token && req.headers.authorization) {
      token = req.headers.authorization.split(" ")[1];
    }

    console.log("token:", token);

    if (!token) {
      return res.json({
        success: false,
        message: "Not Authorized, Login Again",
      });
    }

    const token_decode = jwt.decode(token);

    if (!token_decode) {
      return res.json({
        success: false,
        message: "Invalid Token",
      });
    }

    // ✅ FIXED LINE
    const clerkId = token_decode.sub;

    console.log("✅ ClerkId from token:", clerkId);

    req.body.clerkId = clerkId;

    next();
  } catch (error) {
    console.log("❌ AUTH ERROR:", error.message);
    res.json({ success: false, message: error.message });
  }
};

export default authUser;