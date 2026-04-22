const express = require("express");
const routes = express.Router();
const inquiryController = require("../controllers/InquiryController");
const validatetoken = require("../middleware/AuthMiddleware"); // ✅ Added middleware

// Matches: POST http://localhost:3000/inquiry/sendinquiry
routes.post("/sendinquiry", inquiryController.sendInquiry);

// ✅ UPDATED: Added validatetoken so we know WHICH seller is asking for inquiries
routes.get("/getinquiries", validatetoken, inquiryController.getAllInquiries);

// Matches: PUT http://localhost:3000/inquiry/updateinquiry/:id
routes.put("/updateinquiry/:id", validatetoken, inquiryController.updateInquiry);

// Matches: DELETE http://localhost:3000/inquiry/deleteinquiry/:id
routes.delete("/deleteinquiry/:id", validatetoken, inquiryController.deleteInquiry);

module.exports = routes;