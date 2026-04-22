const userSchema = require("../models/UserModel");
const bcrypt = require("bcrypt");
const mailSend = require("../utils/MailUtil");
const jwt = require("jsonwebtoken");
const crypto = require("crypto"); 
const mongoose = require("mongoose"); // Added for database name logging
const secret = "secret";

const registerUser = async (req, res) => {
  try {
    console.log("--- Manual Signup Attempt ---");
    console.log("Data received:", req.body);
    
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const savedUser = await userSchema.create({
      ...req.body,
      password: hashedPassword,
    });
    
    // Log success and DB details
    console.log("✅ User saved successfully!");
    console.log("Database Name:", mongoose.connection.name);
    console.log("Collection Name:", savedUser.constructor.modelName);

    await mailSend(
      savedUser.email,
      "Welcome to Vehicle Vault",
      `<h1>Welcome to Vehicle Vault 🚗</h1><p>Your account has been created successfully.</p>`
    );

    res.status(201).json({ message: "user created successfully", data: savedUser });
  } catch (err) {
    console.error("❌ Signup Database Error:", err.message);
    res.status(500).json({ message: "error while creating user", err: err.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const foundUser = await userSchema.findOne({ email });

    if (!foundUser) return res.status(404).json({ message: "No account found. Please Sign Up first to create your Vehicle Vault account." });

    if (foundUser.status === "blocked") {
      return res.status(403).json({ message: "Your account is currently blocked." });
    }

    const isPasswordMatched = await bcrypt.compare(password, foundUser.password);
    if (isPasswordMatched) {
      const token = jwt.sign(foundUser.toObject(), secret, { expiresIn: "1d" });
      res.status(200).json({ message: "Login Success", token, role: foundUser.role, data: foundUser });
    } else {
      res.status(401).json({ message: "Invalid Credentials" });
    }
  } catch (err) {
    res.status(500).json({ message: "Server error during login", err: err.message });
  }
};

// LOGIN ONLY: Detects role automatically
const googleLogin = async (req, res) => {
  try {
    const { email } = req.body; 
    let user = await userSchema.findOne({ email });

    if (!user) {
      return res.status(404).json({ 
        message: "No account found. Please Sign Up first with your phone number." 
      });
    }

    const token = jwt.sign(user.toObject(), secret, { expiresIn: "1d" });
    res.status(200).json({ token, role: user.role, data: user });
  } catch (err) {
    res.status(500).json({ message: "Google Login failed", err: err.message });
  }
};

// SIGNUP ONLY: Requires role and phone from the signup form
const googleSignup = async (req, res) => {
  try {
    const { email, firstName, lastName, role, phone } = req.body;
    console.log("--- Google Signup Attempt ---");
    
    let existingUser = await userSchema.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists. Please Login instead." });
    }

    const user = await userSchema.create({
      firstName,
      lastName,
      email,
      phone,
      password: await bcrypt.hash(Math.random().toString(36), 10),
      role: role,
      status: "active"
    });

    console.log("✅ Google User saved to DB:", mongoose.connection.name);

    const token = jwt.sign(user.toObject(), secret, { expiresIn: "1d" });
    res.status(201).json({ message: "Account created successfully", token, role: user.role, data: user });
  } catch (err) {
    console.error("❌ Google Signup Error:", err.message);
    res.status(500).json({ message: "Google Signup failed", err: err.message });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const user = await userSchema.findById(req.user._id).select("-password");
    res.status(200).json({ data: user });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await userSchema.find();
    res.status(200).json({ data: users });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (updateData.password) updateData.password = await bcrypt.hash(updateData.password, 10);
    
    // Updated with returnDocument to remove Mongoose warning
    const updatedUser = await userSchema.findByIdAndUpdate(
      req.params.id, 
      updateData, 
      { returnDocument: 'after' } 
    );
    
    res.status(200).json({ data: updatedUser });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    await userSchema.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userSchema.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const token = crypto.randomBytes(20).toString("hex");
    user.resetpasswordToken = token;
    user.resetpasswordExpire = Date.now() + 3600000; 
    await user.save();

    const resetUrl = `http://localhost:5173/reset-password/${token}`;

    await mailSend(
      email, 
      "Password Reset Link - Vehicle Vault", 
      `<h3>Reset Your Password</h3>
       <p>Click the link below to reset your password. This link expires in 1 hour.</p>
       <a href="${resetUrl}">${resetUrl}</a>`
    );

    res.status(200).json({ message: "Reset link sent to your email" });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await userSchema.findOne({
      resetpasswordToken: token,
      resetpasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset link" });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetpasswordToken = undefined;
    user.resetpasswordExpire = undefined;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile, 
  getAllUsers,
  updateUser,
  deleteUser,
  forgotPassword,
  resetPassword,
  googleLogin,
  googleSignup
};