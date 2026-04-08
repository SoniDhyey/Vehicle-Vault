const express = require('express');
const app = express();
const cors = require('cors');
require("dotenv").config();
const path = require("path");

app.use(express.json());
app.use(cors());

// STATIC FOLDER - Ensure this folder actually exists in your root directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const DBConnection = require('./src/utils/DBConnection');
DBConnection();

const userRoutes = require('./src/routes/UserRoutes');
const vehicleRoutes = require('./src/routes/VehicleRoutes');
const inspectionReportRoutes = require('./src/routes/InspectionReportRoutes');
const offerRoutes = require('./src/routes/OfferRoutes'); 
const testDriveRoutes = require('./src/routes/TestDriveRoutes');
// FIX: Path must point to the src folder
const inquiryRoutes = require("./src/routes/InquiryRoutes"); 

app.use("/user", userRoutes);
app.use("/vehicle", vehicleRoutes);
app.use('/offer', offerRoutes); 
app.use('/testdrive', testDriveRoutes);
app.use("/inquiry", inquiryRoutes);

// ✅ FIX: ADDED THIS LINE - Without this, reports will never work
app.use('/inspection', inspectionReportRoutes); 

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});