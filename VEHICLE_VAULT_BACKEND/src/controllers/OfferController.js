const OfferModel = require("../models/OfferModel");
const mongoose = require("mongoose");
const VehicleModel = require("../models/VehicleModel");

// ✅ SEND OFFER
const makeOffer = async (req, res) => {
  try {
    const { vehicle_id, offered_price } = req.body;
    const buyer_id = req.user._id || req.user.id;

    const vehicle = await VehicleModel.findById(vehicle_id);
    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    const newOffer = await OfferModel.create({
      vehicle_id,
      buyer_id,
      seller_id: vehicle.seller_id,
      offered_price,
      status: "Pending",
    });

    res.status(201).json({
      message: "Offer sent successfully",
      data: newOffer,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error sending offer",
      error: err.message,
    });
  }
};

// ✅ GET ALL USER OFFERS (BUYER OR SELLER)
const getOffers = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;

    const offers = await OfferModel.find({
      $or: [{ seller_id: userId }, { buyer_id: userId }]
    })
      .populate("vehicle_id") 
      .populate("buyer_id", "firstName lastName email phone")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Offers fetched successfully",
      data: offers,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error fetching offers",
      error: err.message,
    });
  }
};

// ✅ UPDATE OFFER STATUS
const updateOffer = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedOffer = await OfferModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    res.status(200).json({
      message: `Offer ${status}`,
      data: updatedOffer,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error updating offer",
      error: err.message,
    });
  }
};

// ✅ DELETE OFFER
const deleteOffer = async (req, res) => {
  try {
    await OfferModel.findByIdAndDelete(req.params.id);
    res.status(200).json({
      message: "Offer deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: "Error deleting offer",
      error: err.message,
    });
  }
};

module.exports = {
  makeOffer,
  getOffers,
  updateOffer,
  deleteOffer,
};