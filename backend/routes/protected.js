const express = require("express");
const router = express.Router();
const { authenticateToken, authorizeRole } = require("../middleware/auth");

// Test authentication
router.get("/test-auth", authenticateToken, (req, res) => {
  res.json({ message: "Authentication successful", user: req.user });
});

// Test role-based access
router.get(
  "/test-role",
  authenticateToken,
  authorizeRole(["admin"]),
  (req, res) => {
    res.json({ message: "Role validation successful", user: req.user });
  }
);

module.exports = router;
