const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const Division = require("./models/Division");
const OU = require("./models/OU");
require("dotenv").config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB...");

    // Clear existing data
    await User.deleteMany({});
    await Division.deleteMany({});
    await OU.deleteMany({});
    console.log("Cleared existing data.");

    // Create Organizational Units
    const ou1 = await OU.create({ name: "Finance Department" });
    const ou2 = await OU.create({ name: "HR Department" });
    const ou3 = await OU.create({ name: "IT Department" });
    const ou4 = await OU.create({ name: "Sales Department" });
    console.log("Organizational Units created.");

    // Create Divisions
    const division1 = await Division.create({
      name: "Accounts Payable",
      organisationalUnit: ou1._id,
      credentials: [
        {
          site: "PayablesTool",
          username: "payable_user1",
          password: "password123",
        },
        {
          site: "InvoiceManager",
          username: "invoice_user1",
          password: "securepassword",
        },
      ],
    });

    const division2 = await Division.create({
      name: "Employee Benefits",
      organisationalUnit: ou2._id,
      credentials: [
        {
          site: "BenefitsPortal",
          username: "benefits_user1",
          password: "benefits123",
        },
        {
          site: "PensionManager",
          username: "pension_user1",
          password: "pensionpass",
        },
      ],
    });

    const division3 = await Division.create({
      name: "Network Security",
      organisationalUnit: ou3._id,
      credentials: [
        {
          site: "FirewallControl",
          username: "firewall_user1",
          password: "firewall123",
        },
        {
          site: "AccessManager",
          username: "access_user1",
          password: "accesspass",
        },
      ],
    });

    const division4 = await Division.create({
      name: "Corporate Sales",
      organisationalUnit: ou4._id,
      credentials: [
        { site: "SalesCRM", username: "sales_user1", password: "sales123" },
        { site: "LeadManager", username: "lead_user1", password: "leadpass" },
      ],
    });

    const division5 = await Division.create({
      name: "Retail Sales",
      organisationalUnit: ou4._id,
      credentials: [
        { site: "RetailCRM", username: "retail_user1", password: "retail123" },
        { site: "POSManager", username: "pos_user1", password: "pospass" },
      ],
    });

    // Update OUs with divisions
    ou1.divisions = [division1._id];
    ou2.divisions = [division2._id];
    ou3.divisions = [division3._id];
    ou4.divisions = [division4._id, division5._id];
    await ou1.save();
    await ou2.save();
    await ou3.save();
    await ou4.save();
    console.log("Divisions associated with OUs.");

    // Create hashed passwords
    const passwords = await Promise.all([
      bcrypt.hash("password123", 10),
      bcrypt.hash("securepassword", 10),
      bcrypt.hash("adminpassword", 10),
      bcrypt.hash("managementpass", 10),
      bcrypt.hash("retailpass", 10),
    ]);

    // Create Users
    const users = await User.insertMany([
      {
        username: "normal_user",
        password: passwords[0],
        role: "normal",
        divisions: [division1._id],
        organisationalUnits: [ou1._id],
      },
      {
        username: "management_user",
        password: passwords[1],
        role: "management",
        divisions: [division1._id, division2._id],
        organisationalUnits: [ou1._id, ou2._id],
      },
      {
        username: "admin_user",
        password: passwords[2],
        role: "admin",
        divisions: [division1._id, division2._id, division3._id],
        organisationalUnits: [ou1._id, ou2._id, ou3._id],
      },
      {
        username: "sales_manager",
        password: passwords[3],
        role: "management",
        divisions: [division4._id, division5._id],
        organisationalUnits: [ou4._id],
      },
      {
        username: "retail_rep",
        password: passwords[4],
        role: "normal",
        divisions: [division5._id],
        organisationalUnits: [ou4._id],
      },
    ]);

    console.log("Users created:");
    console.log(users);

    console.log("Seeding completed successfully!");
    process.exit();
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedData();
