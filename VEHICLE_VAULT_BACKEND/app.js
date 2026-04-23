require("dotenv").config();
const express = require('express');
const app = express();
const cors = require('cors');
const path = require("path");

// 1. UPDATED CORS: This allows your Vercel frontend to talk to this backend
// UPDATED CORS: Allows both your live site and your local testing
app.use(cors({
  origin: ["https://vehicle-vault-alpha.vercel.app", "http://localhost:5173"],
  credentials: true
}));

app.use(express.json());

// STATIC FOLDER
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const DBConnection = require('./src/utils/DBConnection');
DBConnection();

const userRoutes = require('./src/routes/UserRoutes');
const vehicleRoutes = require('./src/routes/VehicleRoutes');
const inspectionReportRoutes = require('./src/routes/InspectionReportRoutes');
const offerRoutes = require('./src/routes/OfferRoutes'); 
const testDriveRoutes = require('./src/routes/TestDriveRoutes');
const helpRoutes = require("./src/routes/HelpRoutes");
const inquiryRoutes = require("./src/routes/InquiryRoutes"); 

// These paths match your frontend calls now
app.use("/user", userRoutes);
app.use("/vehicle", vehicleRoutes);
app.use('/offer', offerRoutes); 
app.use('/testdrive', testDriveRoutes);
app.use("/inquiry", inquiryRoutes);
app.use("/help", helpRoutes);
app.use('/inspection', inspectionReportRoutes); 

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});