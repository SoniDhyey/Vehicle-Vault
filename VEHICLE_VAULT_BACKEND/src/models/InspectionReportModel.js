const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const inspectionReportSchema = new Schema({
  vehicle_id: {
    type: Schema.Types.ObjectId,
    ref: "vehicles", // Matches Vehicle model export
    required: true
  },
  engine_condition: { type: String },
  tyre_condition: { type: String },
  body_condition: { type: String },
  accident_history: { type: String },
  remarks: { type: String },
  inspection_date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("inspection_reports", inspectionReportSchema);