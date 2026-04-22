const mongoose = require("mongoose");
const VehicleModel = require("../models/VehicleModel");

// ADD VEHICLE (Updated for Multi-Image)
const addVehicle = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    
    // req.files comes from upload.array("images")
    const imageUrls = req.files ? req.files.map((file) => file.path) : [];

    const savedVehicle = await VehicleModel.create({
      seller_id: new mongoose.Types.ObjectId(userId),
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
      images: imageUrls, // Store the array of all uploaded images
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
      // ✅ UPDATED: Added lastName and phone to populate
      .populate("seller_id", "firstName lastName email phone")
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
      // ✅ UPDATED: Added lastName and phone to populate
      .populate("seller_id", "firstName lastName email phone")
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

// UPDATE VEHICLE (Updated for Reordering & Multi-Image)
const updateVehicle = async (req, res) => {
  try {
    const vehicle = await VehicleModel.findById(req.params.id);
    const userId = req.user._id || req.user.id;

    if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });

    // Security Check
    if (vehicle.seller_id.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // 1. Handle Existing Image Order (Reordering/Deleting)
    let finalImagesArray = vehicle.images; 
    
    if (req.body.existingImages) {
      try {
        finalImagesArray = JSON.parse(req.body.existingImages);
      } catch (e) {
        finalImagesArray = Array.isArray(req.body.existingImages) 
          ? req.body.existingImages 
          : [req.body.existingImages];
      }
    }

    // 2. Add New Uploaded Images
    if (req.files && req.files.length > 0) {
      const newUrls = req.files.map(file => file.path);
      finalImagesArray = [...finalImagesArray, ...newUrls];
    }

    // 3. Update the Database
    const updatedVehicle = await VehicleModel.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        images: finalImagesArray 
      },
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