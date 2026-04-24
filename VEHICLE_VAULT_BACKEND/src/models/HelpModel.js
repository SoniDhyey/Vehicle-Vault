const mongoose = require("mongoose");

const helpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  message: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ["pending", "resolved"],
    default: "pending"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Use "helps" as the collection name to stay consistent with your controllers
module.exports = mongoose.model("helps", helpSchema);