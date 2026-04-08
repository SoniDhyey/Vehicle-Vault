const express = require("express");
const routes = express.Router();
const inquiryController = require("../controllers/InquiryController");

// Matches: POST http://localhost:3000/inquiry/sendinquiry
routes.post("/sendinquiry", inquiryController.sendInquiry);

// Matches: GET http://localhost:3000/inquiry/getinquiries
// FIX: Changed from getMyInquiries to getAllInquiries to match your controller
routes.get("/getinquiries", inquiryController.getAllInquiries);

// Matches: PUT http://localhost:3000/inquiry/updateinquiry/:id
routes.put("/updateinquiry/:id", inquiryController.updateInquiry);

// Matches: DELETE http://localhost:3000/inquiry/deleteinquiry/:id
routes.delete("/deleteinquiry/:id", inquiryController.deleteInquiry);

module.exports = routes;