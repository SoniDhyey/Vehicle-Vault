const express = require("express");
const routes = express.Router();
const inspectionReportController = require("../controllers/InspectionReportController");

// POST a new report
routes.post("/addreport", inspectionReportController.addInspectionReport);

// GET a specific report for a vehicle
routes.get("/getreport/:vehicleId", inspectionReportController.getReportByVehicleId);

// GET all reports
routes.get("/getreports", inspectionReportController.getInspectionReports);

// UPDATE/DELETE
routes.put("/updatereport/:id", inspectionReportController.updateInspectionReport);
routes.delete("/deletereport/:id", inspectionReportController.deleteInspectionReport);

module.exports = routes;