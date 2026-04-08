const express = require("express");
const router = express.Router();

const offerController = require("../controllers/OfferController");
const validatetoken = require("../middleware/AuthMiddleware");

// ✅ Buyer sends offer
router.post("/makeoffer", validatetoken, offerController.makeOffer);

// ✅ Seller gets offers
router.get("/getoffers", validatetoken, offerController.getOffers);

// ✅ Seller updates offer (Accept/Reject)
router.put("/updateoffer/:id", validatetoken, offerController.updateOffer);

// ✅ Delete offer
router.delete("/deleteoffer/:id", validatetoken, offerController.deleteOffer);

module.exports = router;