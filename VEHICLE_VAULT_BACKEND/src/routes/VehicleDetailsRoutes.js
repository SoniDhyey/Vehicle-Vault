const routes = require("express").Router()
const vehicleImgController = require("../controllers/VehicleImgController")

routes.post("/addimage",vehicleImgController.addVehicleImage)

routes.get("/getimages/:vehicle_id",vehicleImgController.getVehicleImages)

routes.put("/updateimage/:id", vehicleImgController.updateVehicleImage)

routes.delete("/deleteimage/:id",vehicleImgController.deleteVehicleImage)

module.exports = routes