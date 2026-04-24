const userSchema = require("../models/UserModel");
const bcrypt = require("bcrypt");
const mailSend = require("../utils/MailUtil");
const jwt = require("jsonwebtoken");
const crypto = require("crypto"); 
const mongoose = require("mongoose");
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const secret = "secret";

const registerUser = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const savedUser = await userSchema.create({
      ...req.body,
      password: hashedPassword,
    });
    await mailSend(
      savedUser.email,
      "Welcome to Vehicle Vault",
      `<h1>Welcome to Vehicle Vault 🚗</h1><p>Your account has been created successfully.</p>`
    );
    res.status(201).json({ message: "user created successfully", data: savedUser });
  } catch (err) {
    res.status(500).json({ message: "error while creating user", err: err.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const foundUser = await userSchema.findOne({ email });
    if (!foundUser) return res.status(404).json({ message: "No account found." });
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

const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    const { email } = ticket.getPayload();

    let user = await userSchema.findOne({ email });
    if (!user) return res.status(404).json({ message: "No account found. Please Sign Up first." });

    const jwtToken = jwt.sign(user.toObject(), secret, { expiresIn: "1d" });
    res.status(200).json({ token: jwtToken, role: user.role, data: user });
  } catch (err) {
    res.status(500).json({ message: "Google Login failed", err: err.message });
  }
};

const googleSignup = async (req, res) => {
  try {
    const { token, role, phone } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    const { email, given_name, family_name } = ticket.getPayload();
    
    let existingUser = await userSchema.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists. Please Login." });

    const user = await userSchema.create({
      firstName: given_name,
      lastName: family_name,
      email,
      phone,
      password: await bcrypt.hash(Math.random().toString(36), 10),
      role: role,
      status: "active"
    });

    const jwtToken = jwt.sign(user.toObject(), secret, { expiresIn: "1d" });
    res.status(201).json({ message: "Account created successfully", token: jwtToken, role: user.role, data: user });
  } catch (err) {
    res.status(500).json({ message: "Google Signup failed", err: err.message });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const user = await userSchema.findById(req.user._id).select("-password");
    res.status(200).json({ data: user });
  } catch (err) { res.status(500).json({ err: err.message }); }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await userSchema.find();
    res.status(200).json({ data: users });
  } catch (err) { res.status(500).json({ err: err.message }); }
};

const updateUser = async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (updateData.password) updateData.password = await bcrypt.hash(updateData.password, 10);
    const updatedUser = await userSchema.findByIdAndUpdate(req.params.id, updateData, { returnDocument: 'after' });
    res.status(200).json({ data: updatedUser });
  } catch (err) { res.status(500).json({ err: err.message }); }
};

const deleteUser = async (req, res) => {
  try {
    await userSchema.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "User deleted" });
  } catch (err) { res.status(500).json({ err: err.message }); }
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
    await mailSend(email, "Password Reset Link", `<a href="${resetUrl}">Reset Password</a>`);
    res.status(200).json({ message: "Reset link sent" });
  } catch (err) { res.status(500).json({ err: err.message }); }
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    const user = await userSchema.findOne({ resetpasswordToken: token, resetpasswordExpire: { $gt: Date.now() } });
    if (!user) return res.status(400).json({ message: "Invalid/expired link" });
    user.password = await bcrypt.hash(password, 10);
    user.resetpasswordToken = undefined;
    user.resetpasswordExpire = undefined;
    await user.save();
    res.status(200).json({ message: "Password updated" });
  } catch (err) { res.status(500).json({ err: err.message }); }
};

module.exports = { registerUser, loginUser, getUserProfile, getAllUsers, updateUser, deleteUser, forgotPassword, resetPassword, googleLogin, googleSignup };