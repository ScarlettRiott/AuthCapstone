const express = require("express");
const router = express.Router();
const OU = require("../models/OU");
const { authenticateToken, authorizeRole } = require("../middleware/auth");

// Add a credential to an OU
router.post(
  "/:ouId/credentials",
  authenticateToken,
  authorizeRole(["admin", "management"]),
  async (req, res) => {
    const { ouId } = req.params;
    const { site, username, password } = req.body;

    if (!site || !username || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    try {
      const ou = await OU.findById(ouId);

      if (!ou) {
        return res.status(404).json({ message: "OU not found" });
      }

      // Add the credential to the OU
      const credential = { site, username, password };
      ou.credentials.push(credential);
      await ou.save();

      res
        .status(201)
        .json({ message: "Credential added successfully", credential });
    } catch (error) {
      console.error("Error adding credential:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

module.exports = router;
