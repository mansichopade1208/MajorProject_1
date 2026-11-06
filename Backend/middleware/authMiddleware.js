
import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
  try {
    // Get authorization header
    const authHeader = req.headers.authorization;

    // Check whether token exists
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authentication required. Please log in.",
      });
    }

    // Extract token
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication token is missing.",
      });
    }

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // Validate token payload
    if (!decoded.userId || !["patient", "doctor"].includes(decoded.role)) {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token.",
      });
    }

    // Attach authenticated user information to request
    req.user = {
      userId: decoded.userId,
      role: decoded.role,
    };

    // Continue to the requested route
    next();

  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Your session has expired. Please log in again.",
      });
    }

    return res.status(401).json({
      success: false,
      message: "Invalid or expired authentication token.",
    });
  }
};
