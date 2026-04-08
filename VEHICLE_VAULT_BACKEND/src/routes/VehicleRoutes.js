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

routes.post("/addvehicle", validatetoken, upload.single("image"), vehicleController.addVehicle);
routes.get("/myvehicles", validatetoken, vehicleController.getMyVehicles);
routes.get("/getvehicles", validatetoken, vehicleController.getAllVehicles);
routes.get("/getvehicle/:id", vehicleController.getVehicleById);
routes.put("/updatevehicle/:id", validatetoken, vehicleController.updateVehicle); 
routes.delete("/deletevehicle/:id", validatetoken, vehicleController.deleteVehicle);

module.exports = routes;