const express = require("express");
const router = express.Router();
const Division = require("../models/Division");
const { authenticateToken, authorizeRole } = require("../middleware/auth");

// Get credentials for a specific division
router.get("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const division = await Division.findById(id);
    if (!division) {
      return res.status(404).json({ message: "Division not found" });
    }

    res.json(division.credentials);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

//Add new credentials
router.post("/:id", authenticateToken, async (req, res) => {
  const { id } = rwq.params;
  const { site, username, password } = req.body;

  try {
    const division = await Division.findById(id);

    if (!division) {
      return res.status(404).json({ message: "Division not found" });
    }

    division.credentials.push({ site, username, password });
    await division.save();

    res.json({ message: "Credentials added successfully", division });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

//Update credentials (Management role required)
router.put(
  "/:divisionId/:credentialId",
  authenticateToken,
  authorizeRole(["management", "admin"]),
  async (req, res) => {
    const { divisionId, credentialId } = req.params;
    const { site, username, password } = req.body;

    try {
      const division = await Division.findById(divisionId);

      if (!division) {
        return res.status(404).json({ message: "Division not found" });
      }

      const credential = division.credentials.id(credentialId);
      if (!credential) {
        return res.status(404).json({ message: "Credential not found" });
      }

      credential.site = site;
      credentiall.username = username;
      credential.password = password;

      await division.save();

      res.json({ message: "Credentials updated successfully", division });
    } catch (error) {
      res.status(500), json({ message: "Server error", error: error.message });
    }
  }
);

// Route to read credentials from a specific division
router.get(
  "/:divisionId",
  authenticateToken,
  authorizeRole(["normal", "management", "admin"]),
  async (req, res) => {
    const { divisionId } = req.params;

    try {
      const division = await Division.findById(divisionId).populate(
        "credentials"
      );

      if (!division) {
        return res.status(404).json({ message: "Division not found" });
      }

      res.json(division.credentials);
    } catch (error) {
      console.error("Error fetching credentials:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

// Route to add a credential to a specific division
router.post(
  "/:divisionId",
  authenticateToken,
  authorizeRole(["normal", "management", "admin"]),
  async (req, res) => {
    const { divisionId } = req.params;
    const { site, username, password } = req.body;

    if (!site || !username || !password) {
      return res
        .status(400)
        .json({ message: "Site, username, and password are required" });
    }

    try {
      const division = await Division.findById(divisionId);

      if (!division) {
        return res.status(404).json({ message: "Division not found" });
      }

      // Add the credential to the division
      const credential = { site, username, password };
      division.credentials.push(credential);
      await division.save();

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
