const InquiryModel = require("../models/InquiryModel");

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

const getAllInquiries = async (req, res) => {
  try {
    const inquiries = await InquiryModel.find()
      .populate("vehicle_id", "make model price images") // ✅ FIXED: Ensure these match VehicleSchema
      .sort({ inquiry_date: -1 });

    res.status(200).json({
      message: "Inquiries fetched",
      data: inquiries
    });
  } catch (err) {
    res.status(500).json({
      message: "Error while fetching inquiries",
      err: err
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