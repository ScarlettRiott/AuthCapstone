require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173", // Replace with your frontend's URL
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
    credentials: true, // Allow cookies and credentials
  })
);
app.use(express.json());

// Connect to Database
connectDB();

// Routes
app.use("/auth", require("./routes/auth"));
app.use("/credentials", require("./routes/credentials"));
app.use("/admin", require("./routes/admin"));
app.use("/protected", require("./routes/protected")); // Optional testing route

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
