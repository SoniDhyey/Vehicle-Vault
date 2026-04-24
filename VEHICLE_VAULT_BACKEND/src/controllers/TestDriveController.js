const TestDriveModel = require("../models/TestDriveModel");
const VehicleModel = require("../models/VehicleModel");

// BOOK TEST DRIVE
const bookTestDrive = async (req, res) => {
  try {
    const testDrive = await TestDriveModel.create({
      ...req.body,
      buyer_id: req.user._id,
      status: "Pending" 
    });
    res.status(201).json({ message: "Test drive booked successfully", data: testDrive });
  } catch (err) {
    res.status(500).json({ message: "Error booking test drive", error: err.message });
  }
};

// GET TEST DRIVES (For Buyer Side)
const getTestDrives = async (req, res) => {
  try {
    const testDrives = await TestDriveModel.find({ buyer_id: req.user._id })
      .populate("vehicle_id")
      .populate("buyer_id", "firstName lastName email")
      .sort({ createdAt: -1 }); 
    res.status(200).json({ message: "Fetched successfully", data: testDrives });
  } catch (err) {
    res.status(500).json({ message: "Error fetching bookings", error: err.message });
  }
};

// GET REQUESTS FOR SELLER
const getSellerRequests = async (req, res) => {
  try {
    const myVehicles = await VehicleModel.find({ seller_id: req.user._id }).select("_id");
    const vehicleIds = myVehicles.map(v => v._id);

    const requests = await TestDriveModel.find({ vehicle_id: { $in: vehicleIds } })
      .populate("vehicle_id")
      .populate("buyer_id", "firstName lastName email")
      .sort({ createdAt: -1 }); // Added sorting

    res.status(200).json({ data: requests });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch seller requests", details: err.message });
  }
};

const updateTestDrive = async (req, res) => {
  try {
    const testDrive = await TestDriveModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!testDrive) return res.status(404).json({ message: "Request not found" });
    res.status(200).json({ message: "Status updated", data: testDrive });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteTestDrive = async (req, res) => {
  try {
    await TestDriveModel.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  bookTestDrive,
  getTestDrives,
  getSellerRequests,
  updateTestDrive,
  deleteTestDrive
};