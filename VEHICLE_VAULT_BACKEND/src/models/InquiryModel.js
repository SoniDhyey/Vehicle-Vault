const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const inquirySchema = new Schema({
  buyer_id: {
    type: Schema.Types.ObjectId,
    ref: "users", // Ensure this matches your User model export name
    required: true
  },
  vehicle_id: {
    type: Schema.Types.ObjectId,
    ref: "Vehicle", // ✅ FIXED: Changed "vehicles" to "Vehicle" to match your model
    required: true
  },
  message: {
    type: String,
    required: true
  },
  reply: {
    type: String,
    default: ""
  },
  status: {
    type: String,
    enum: ["pending", "resolved"],
    default: "pending"
  },
  inquiry_date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("inquiries", inquirySchema);