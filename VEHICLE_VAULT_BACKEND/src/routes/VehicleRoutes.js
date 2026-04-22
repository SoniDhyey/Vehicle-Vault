const routes = require("express").Router();
const vehicleController = require("../controllers/VehicleController");
const validatetoken = require("../middleware/AuthMiddleware");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../utils/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "vehicles",
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

const upload = multer({ storage });

// ✅ Use .array("images") for multiple images
routes.post("/addvehicle", validatetoken, upload.array("images"), vehicleController.addVehicle);
routes.get("/myvehicles", validatetoken, vehicleController.getMyVehicles);
routes.get("/getvehicles", validatetoken, vehicleController.getAllVehicles);
routes.get("/getvehicle/:id", vehicleController.getVehicleById);

// ✅ FIX: Added upload.array("images") here so the controller receives the file data
routes.put("/updatevehicle/:id", validatetoken, upload.array("images"), vehicleController.updateVehicle); 
routes.delete("/deletevehicle/:id", validatetoken, vehicleController.deleteVehicle);

module.exports = routes;