const InspectionReportModel = require("../models/InspectionReportModel");
const VehicleModel = require("../models/VehicleModel");

// CREATE & LINK TO VEHICLE
const addInspectionReport = async (req, res) => {
  try {
    // 1. Create the report
    const report = await InspectionReportModel.create(req.body);

    // 2. Link report AND update status to "available"
    await VehicleModel.findByIdAndUpdate(req.body.vehicle_id, {
      report_id: report._id,
      status: "available" 
    });

    res.status(201).json({
      message: "Inspection report added and vehicle is now available",
      data: report
    });
  } catch (err) {
    res.status(500).json({ message: "Error adding report", error: err.message });
  }
};

const getReportByVehicleId = async (req, res) => {
  try {
    const report = await InspectionReportModel.findOne({ vehicle_id: req.params.vehicleId });
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }
    res.status(200).json({ data: report });
  } catch (err) {
    res.status(500).json({ message: "Error fetching report", error: err.message });
  }
};

const getInspectionReports = async (req, res) => {
  try {
    const reports = await InspectionReportModel.find().populate("vehicle_id");
    res.status(200).json({ data: reports });
  } catch (err) {
    res.status(500).json({ message: "Error fetching reports", error: err.message });
  }
};

// UPDATE - Logic added to update Vehicle Status here as well
const updateInspectionReport = async (req, res) => {
  try {
    const updatedReport = await InspectionReportModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    // After updating report, ensure the parent vehicle is set to "available"
    if (updatedReport) {
      await VehicleModel.findByIdAndUpdate(updatedReport.vehicle_id, {
        status: "available"
      });
    }

    res.status(200).json({ 
      message: "Updated successfully and vehicle status verified as available", 
      data: updatedReport 
    });
  } catch (err) {
    res.status(500).json({ message: "Update failed", error: err.message });
  }
};

const deleteInspectionReport = async (req, res) => {
  try {
    const report = await InspectionReportModel.findById(req.params.id);
    if (report) {
      await VehicleModel.findByIdAndUpdate(report.vehicle_id, {
        $unset: { report_id: "" },
        status: "pending" 
      });
      await InspectionReportModel.findByIdAndDelete(req.params.id);
    }
    res.status(200).json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Deletion failed", error: err.message });
  }
};

module.exports = {
  addInspectionReport,
  getReportByVehicleId,
  getInspectionReports,
  updateInspectionReport,
  deleteInspectionReport
};