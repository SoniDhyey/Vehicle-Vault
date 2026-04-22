const InquiryModel = require("../models/InquiryModel");
const VehicleModel = require("../models/VehicleModel");

const sendInquiry = async (req, res) => {
  try {
    const inquiry = await InquiryModel.create(req.body);
    res.status(201).json({
      message: "Inquiry sent successfully",
      data: inquiry
    });
  } catch (err) {
    res.status(500).json({
      message: "Error while sending inquiry",
      err: err
    });
  }
};

// ✅ UPDATED: Now handles both Buyer and Seller views
const getAllInquiries = async (req, res) => {
  try {
    const userId = req.user._id;
    const userRole = req.user.role; // Assuming you have role in your token/req.user

    let inquiries;

    if (userRole === "seller") {
      // 1. Logic for Sellers: Find inquiries for their vehicles
      const sellerVehicles = await VehicleModel.find({ seller_id: userId }).select("_id");
      const vehicleIds = sellerVehicles.map(v => v._id);

      inquiries = await InquiryModel.find({ vehicle_id: { $in: vehicleIds } })
        .populate("vehicle_id", "make model price images")
        .populate("buyer_id", "firstName lastName email")
        .sort({ inquiry_date: -1 });
    } else {
      // 2. Logic for Buyers: Find inquiries they personally sent
      inquiries = await InquiryModel.find({ buyer_id: userId })
        .populate("vehicle_id", "make model price images")
        .populate("buyer_id", "firstName lastName email")
        .sort({ inquiry_date: -1 });
    }

    res.status(200).json({
      message: "Inquiries fetched",
      data: inquiries
    });
  } catch (err) {
    res.status(500).json({
      message: "Error while fetching inquiries",
      err: err.message
    });
  }
};

const updateInquiry = async (req, res) => {
  try {
    const updatedInquiry = await InquiryModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json({
      message: "Inquiry updated successfully",
      data: updatedInquiry
    });
  } catch (err) {
    res.status(500).json({
      message: "Error while updating inquiry",
      err: err
    });
  }
};

const deleteInquiry = async (req, res) => {
  try {
    await InquiryModel.findByIdAndDelete(req.params.id);
    res.status(200).json({
      message: "Inquiry deleted successfully"
    });
  } catch (err) {
    res.status(500).json({
      message: "Error while deleting inquiry",
      err: err
    });
  }
};

module.exports = {
  sendInquiry,
  getAllInquiries,
  updateInquiry,
  deleteInquiry
};