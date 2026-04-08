const Help = require("../models/HelpModel");

const createHelp = async (req, res) => {
  try {
    const data = await Help.create(req.body);

    res.status(201).json({
      message: "Query submitted",
      data
    });

  } catch (err) {
    res.status(500).json({
      message: "Error submitting query"
    });
  }
};

module.exports = { createHelp };