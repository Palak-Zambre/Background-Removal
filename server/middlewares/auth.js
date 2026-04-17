import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
  try {
    let token;

    // ✅ ALWAYS read from Authorization header
    if (req.headers.authorization) {
      token = req.headers.authorization.split(" ")[1];
    }

    console.log("TOKEN:", token);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    const decoded = jwt.decode(token);

    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    // ✅ VERY IMPORTANT (CLERK ID FIX)
    req.body.clerkId = decoded.sub;

    console.log("✅ ClerkId:", decoded.sub);

    next();
  } catch (error) {
    console.log("❌ AUTH ERROR:", error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export default authUser;