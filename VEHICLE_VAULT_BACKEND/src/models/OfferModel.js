const mongoose = require("mongoose");

const offerSchema = new mongoose.Schema({
  buyer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true
  },
  seller_id: { // ✅ ADD THIS
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true
  },
  vehicle_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vehicle",
    required: true
  },
  offered_price: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ["Pending", "Accepted", "Rejected"],
    default: "Pending"
  }
}, { timestamps: true });

module.exports = mongoose.model("offers", offerSchema);