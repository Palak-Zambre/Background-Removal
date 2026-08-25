import { clerkClient } from "@clerk/clerk-sdk-node";

const authUser = async (req, res, next) => {
  try {
    const [scheme, token] = (req.headers.authorization || "").split(" ");
    if (scheme !== "Bearer" || !token) {
      return res.status(401).json({ success: false, message: "Authentication token is required" });
    }

    if (!process.env.CLERK_SECRET_KEY) {
      return res.status(503).json({ success: false, message: "Authentication is not configured on the server" });
    }

    const payload = await clerkClient.verifyToken(token);
    if (!payload?.sub) {
      return res.status(401).json({ success: false, message: "Invalid authentication token" });
    }

    req.auth = { clerkId: payload.sub };
    next();
  } catch (error) {
    console.log("Authentication error:", error.message);
    return res.status(401).json({ success: false, message: "Invalid or expired authentication token" });
  }
};

export default authUser;
