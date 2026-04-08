const routes = require("express").Router();
const testDriveController = require("../controllers/TestDriveController");
const validatetoken = require("../middleware/AuthMiddleware");

// These names must match the frontend axios calls exactly
routes.post("/booktestdrive", validatetoken, testDriveController.bookTestDrive);
routes.get("/gettestdrives", validatetoken, testDriveController.getTestDrives);
routes.get("/sellerrequests", validatetoken, testDriveController.getSellerRequests); 
routes.put("/updatetestdrive/:id", validatetoken, testDriveController.updateTestDrive);
routes.delete("/deletetestdrive/:id", validatetoken, testDriveController.deleteTestDrive);

module.exports = routes;