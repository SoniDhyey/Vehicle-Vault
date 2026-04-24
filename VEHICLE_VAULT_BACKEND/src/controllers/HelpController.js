const Help = require("../models/HelpModel");

const createHelp = async (req, res) => {
  try {
    const { email, message } = req.body;

    // 1. VALIDATION: Prevent empty submissions from hitting the DB
    if (!email || !message) {
      return res.status(400).json({
        message: "Please provide both email and message"
      });
    }

    // 2. CREATION: Save to MongoDB Compass
    const data = await Help.create({ 
      email: email.trim().toLowerCase(), 
      message: message.trim() 
    });

    // Logging for your terminal
    console.log(`🚀 New Support Ticket from: ${email}`);

    // 3. SUCCESS RESPONSE
    res.status(201).json({
      message: "Query submitted successfully",
      data
    });

  } catch (err) {
    // 4. ERROR HANDLING: Detailed logging for debugging
    console.error("Help Submission Error:", err.message);
    
    res.status(500).json({
      message: "Server error: Could not submit query",
      error: err.message
    });
  }
};

module.exports = { createHelp };