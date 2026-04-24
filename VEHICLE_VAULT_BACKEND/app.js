require("dotenv").config();
const express = require('express');
const app = express();
const cors = require('cors');
const path = require("path");

// 1. SECURITY & AUTH HEADERS
// Updated to ensure Google Auth popups and cross-origin requests are permitted
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  res.setHeader("Cross-Origin-Embedder-Policy", "unsafe-none"); 
  next();
});

// 2. UPDATED CORS (The most important fix)
// Added your Render URL so the backend can talk to itself if needed
app.use(cors({
  origin: [
    "https://vehicle-vault-alpha.vercel.app", 
    "https://vehicle-vault-backend.onrender.com",
    "http://localhost:5173",
    "http://192.168.4.103:5173"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// DATABASE CONNECTION
const DBConnection = require('./src/utils/DBConnection');
DBConnection();

// ROUTES
const userRoutes = require('./src/routes/UserRoutes');
const vehicleRoutes = require('./src/routes/VehicleRoutes');
const inspectionReportRoutes = require('./src/routes/InspectionReportRoutes');
const offerRoutes = require('./src/routes/OfferRoutes'); 
const testDriveRoutes = require('./src/routes/TestDriveRoutes');
const helpRoutes = require("./src/routes/HelpRoutes");
const inquiryRoutes = require("./src/routes/InquiryRoutes"); 

app.use("/user", userRoutes);
app.use("/vehicle", vehicleRoutes);
app.use('/offer', offerRoutes); 
app.use('/testdrive', testDriveRoutes);
app.use("/inquiry", inquiryRoutes);
app.use("/help", helpRoutes);
app.use('/inspection', inspectionReportRoutes); 

// START SERVER
const PORT = process.env.PORT || 3000;
// '0.0.0.0' allows the server to be reached outside of just 'localhost'
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});