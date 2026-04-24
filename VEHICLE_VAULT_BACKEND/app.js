require("dotenv").config();
const express = require('express');
const app = express();
const cors = require('cors');
const path = require("path");

// 1. SECURITY HEADERS: Fixes "Google Auth Failed" and COOP errors
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  res.setHeader("Cross-Origin-Embedder-Policy", "unsafe-none"); // Set to unsafe-none to allow Google scripts
  next();
});

// 2. UPDATED CORS: Explicitly allows your Vercel URL and local development
app.use(cors({
  origin: ["https://vehicle-vault-alpha.vercel.app", "http://localhost:5173"],
  methods: ["GET", "POST", "PUT", "DELETE"],
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

// Route Mounting
app.use("/user", userRoutes);
app.use("/vehicle", vehicleRoutes);
app.use('/offer', offerRoutes); 
app.use('/testdrive', testDriveRoutes);
app.use("/inquiry", inquiryRoutes);
app.use("/help", helpRoutes);
app.use('/inspection', inspectionReportRoutes); 

// 3. START SERVER: '0.0.0.0' allows access from your phone via your Laptop's IP
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});