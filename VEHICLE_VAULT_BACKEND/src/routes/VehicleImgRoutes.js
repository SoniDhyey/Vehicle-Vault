const routes = require("express").Router();

const vehicleImgController = require("../controllers/VehicleImgController");

const upload = require("../middleware/UploadMiddleware");

routes.post("/addimage", upload.single("image"),vehicleImgController.addVehicleImage);

routes.get("/getimages/:vehicle_id", vehicleImgController.getVehicleImages);

routes.put("/updateimage/:id", upload.single("image"),vehicleImgController.updateVehicleImage);

routes.delete("/deleteimage/:id", vehicleImgController.deleteVehicleImage);



module.exports = routes;
