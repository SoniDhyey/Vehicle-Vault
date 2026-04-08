const mongoose = require("mongoose");

const VehicleSchema = new mongoose.Schema({
  seller_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users", 
    required: true,
  },
  report_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "inspection_reports",
    default: null,
  },
  make: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  price: { type: Number, required: true },
  fuel_type: { type: String, default: "petrol" },
  transmission: { type: String, default: "manual" },
  mileage: { type: Number },
  color: { type: String },
  location: { type: String },
  description: { type: String },
  images: [{ type: String }],
  status: { type: String, default: "available" },
}, { timestamps: true });

module.exports = mongoose.model("Vehicle", VehicleSchema);