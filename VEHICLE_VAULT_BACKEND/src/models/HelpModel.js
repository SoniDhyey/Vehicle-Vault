// models/HelpModel.js
const mongoose = require("mongoose");

const helpSchema = new mongoose.Schema({
  email: String,
  password: String,
  message: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("help", helpSchema);