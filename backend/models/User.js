const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["normal", "management", "admin"],
    default: "normal",
  },
  divisions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Division" }],
  organisationalUnits: [{ type: mongoose.Schema.Types.ObjectId, ref: "OU" }],
});

module.exports = mongoose.model("User", userSchema);
