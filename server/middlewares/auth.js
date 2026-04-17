import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
  try {
    let token = req.headers.token;

    // 🔥 Support Bearer token (important)
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

    req.body.clerkId = token_decode.clerkId;

    next();
  } catch (error) {
    console.log("error:", error.message);
    res.json({ success: false, message: error.message });
  }
};

export default authUser;