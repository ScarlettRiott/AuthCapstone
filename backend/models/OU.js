const mongoose = require("mongoose");

const CredentialSchema = new mongoose.Schema({
  site: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
});

const OUSchema = new mongoose.Schema({
  name: { type: String, required: true },
  divisions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Division" }],
  credentials: [CredentialSchema], // Add credentials here
});

module.exports = mongoose.model("OU", OUSchema);
