const mongoose = require("mongoose");

const testDriveSchema = new mongoose.Schema({
  buyer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users", 
    required: true
  },
  vehicle_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vehicle",
    required: true
  },
  preferred_date: {
    type: Date,
    required: true
  },
  preferred_time: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Completed", "Cancelled"],
    default: "Pending"
  }
}, { timestamps: true }); // Automatically creates createdAt and updatedAt

module.exports = mongoose.model("test_drives", testDriveSchema);