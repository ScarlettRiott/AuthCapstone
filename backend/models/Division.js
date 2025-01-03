const mongoose = require("mongoose");

const divisionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  credentials: [
    {
      site: { type: String, required: true },
      username: { type: String, required: true },
      password: { type: String, required: true },
    },
  ],
  organisationalUnits: [{ type: mongoose.Schema.Types.ObjectId, ref: "OU" }],
});

module.exports = mongoose.model("Division", divisionSchema);
