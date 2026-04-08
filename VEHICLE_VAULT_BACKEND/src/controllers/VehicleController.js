const mongoose = require("mongoose");
const VehicleModel = require("../models/VehicleModel");

const addVehicle = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    
    const savedVehicle = await VehicleModel.create({
      seller_id: new mongoose.Types.ObjectId(userId), // Explicitly cast to ObjectId
      make: req.body.make,
      model: req.body.model,
      year: req.body.year,
      mileage: req.body.mileage,
      fuel_type: req.body.fuel_type?.toLowerCase() || "petrol",
      transmission: req.body.transmission?.toLowerCase() || "manual",
      color: req.body.color,
      location: req.body.location,
      description: req.body.description,
      price: Number(req.body.price),
      // req.file.path is the full Cloudinary URL provided by cloudinary-multer
      images: req.file ? [req.file.path] : [], 
    });

    res.status(201).json({
      message: "Vehicle added successfully",
      data: savedVehicle,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error while adding vehicle",
      err: err.message,
    });
  }
};

const getAllVehicles = async (req, res) => {
  try {
    const vehicles = await VehicleModel.find()
      .populate("seller_id", "firstName email phone")
      .populate("report_id");

    res.status(200).json({
      message: "Vehicles fetched successfully",
      data: vehicles || []
    });
  } catch (err) {
    res.status(500).json({
      message: "Error while fetching vehicles",
      data: []
    });
  }
};

const getMyVehicles = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    
    // Using new mongoose.Types.ObjectId(userId) ensures the query matches the Schema type
    const vehicles = await VehicleModel.find({ 
      seller_id: new mongoose.Types.ObjectId(userId) 
    }).populate("report_id");

    res.status(200).json({
      message: "My vehicles fetched successfully",
      data: vehicles || [],
    });
  } catch (err) {
    res.status(500).json({
      message: "Error fetching my vehicles",
      err: err.message,
    });
  }
};

const getVehicleById = async (req, res) => {
  try {
    const vehicle = await VehicleModel.findById(req.params.id)
      .populate("seller_id", "firstName email phone")
      .populate("report_id");

    if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });

    res.status(200).json({
      message: "Vehicle fetched successfully",
      data: vehicle,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error fetching vehicle",
      err: err.message,
    });
  }
};

const updateVehicle = async (req, res) => {
  try {
    const vehicle = await VehicleModel.findById(req.params.id);
    const userId = req.user._id || req.user.id;

    if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });

    if (vehicle.seller_id.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const updatedVehicle = await VehicleModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate("report_id");

    res.status(200).json({
      message: "Vehicle updated successfully",
      data: updatedVehicle,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error while updating vehicle",
      err: err.message,
    });
  }
};

const deleteVehicle = async (req, res) => {
  try {
    const vehicle = await VehicleModel.findById(req.params.id);
    const userId = req.user._id || req.user.id;

    if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });
    
    if (vehicle.seller_id.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await VehicleModel.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Vehicle deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error while deleting vehicle", err: err.message });
  }
};

module.exports = {
  addVehicle,
  getAllVehicles,
  getMyVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
};