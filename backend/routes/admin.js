const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Division = require("../models/Division");
const OU = require("../models/OU");
const { authenticateToken, authorizeRole } = require("../middleware/auth");

//Assign user to a division
router.post(
  "/assign-division",
  authenticateToken,
  authorizeRole(["admin"]),
  async (req, res) => {
    const { userId, divisionId } = req.body;

    try {
      const user = await User.findById(userId);
      const division = await Division.findById(divisionId);

      if (!user || !division) {
        return res.status(404).json({ message: "User or Division not found" });
      }

      if (!user.divisions.includes(divisionId)) {
        user.division.push(divisionId);
        await user.save();
      }

      res.json({ message: "User assigned to division successfully", user });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

//Unassign user from a division
router.post(
  "/unassign-division",
  authenticateToken,
  authorizeRole(["admin"]),
  async (req, res) => {
    const { userId, role } = req.body;

    try {
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      user.divisions = user.divisions.filter(
        (id) => id.toString() !== divisionId
      );
      await user.save();

      res.json({ message: "User unassigned from division successfully", user });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

//Change user role
router.put(
  "/change-role",
  authenticateToken,
  authorizeRole(["admin"]),
  async (req, res) => {
    const { userId, divisionId } = req.body;

    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      user.role = role;
      await user.save();

      res.json({ message: "User role updated successfully", user });
    } catch (error) {
      res.status(500).json({ message: "Server error ", error: error.message });
    }
  }
);

// Route to fetch users in the admin's OUs
router.get(
  "/users-in-ou",
  authenticateToken,
  authorizeRole(["admin", "management"]),
  async (req, res) => {
    console.log("Route hit: /users-in-ou");
    try {
      const admin = await User.findById(req.user.id).populate(
        "organisationalUnits"
      );

      if (!admin) {
        console.log("Admin not found");
        return res.status(404).json({ message: "Admin not found" });
      }

      const ouIds = admin.organisationalUnits.map((ou) => ou._id.toString());
      console.log("Fetching users for OUs:", ouIds);

      const users = await User.find({
        organisationalUnits: { $in: ouIds },
      }).select("username _id role");
      console.log("Users fetched:", users);
      res.json(users);
    } catch (error) {
      console.error("Error fetching users in OUs:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

module.exports = router;
