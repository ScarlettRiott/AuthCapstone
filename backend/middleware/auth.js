const jwt = require("jsonwebtoken");

/**
 * Middleware to authenticate the user by validating the JWT token.
 */
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user details to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    return res
      .status(403)
      .json({ message: "Forbidden: Invalid or expired token" });
  }
};

/**
 * Middleware to authorize user roles.
 * @param {Array<string>} roles - List of roles allowed to access the route.
 */
const authorizeRole = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res
      .status(403)
      .json({ message: "Access denied: Insufficient permissions" });
  }
  next(); // Proceed if the user has the correct role
};

module.exports = { authenticateToken, authorizeRole };
