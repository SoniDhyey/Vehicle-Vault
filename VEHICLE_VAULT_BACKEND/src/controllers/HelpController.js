const Help = require("../models/HelpModel");

const createHelp = async (req, res) => {
  try {
    
    const { email, message } = req.body;

    const data = await Help.create({ email, message });

    console.log("🚀 New Support Ticket Created in Compass!");

    res.status(201).json({
      message: "Query submitted successfully",
      data
    });

  } catch (err) {
    console.error("Help Submission Error:", err.message);
    res.status(500).json({
      message: "Error submitting query",
      error: err.message
    });
  }
};

module.exports = { createHelp };