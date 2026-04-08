const userSchema = require("../models/UserModel");
const bcrypt = require("bcrypt");
const mailSend = require("../utils/MailUtil");
const jwt = require("jsonwebtoken");
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
      `
      <h1>Welcome to Vehicle Vault 🚗</h1>
      <p>Your account has been created <b>successfully</b>.</p>
      <p>Now you can explore vehicles on our platform.</p>
      `
    );

    res.status(201).json({
      message: "user created successfully",
      data: savedUser,
    });
  } catch (err) {
    console.log("REGISTER ERROR:", err);
    res.status(500).json({
      message: "error while creating user",
      err: err.message,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const foundUser = await userSchema.findOne({ email });

    if (!foundUser) return res.status(404).json({ message: "User not found" });

    if (foundUser.status === "blocked") {
      return res.status(403).json({ message: "Your account is currently blocked by administration." });
    }

    const isPasswordMatched = await bcrypt.compare(password, foundUser.password);
    if (isPasswordMatched) {
      const token = jwt.sign(foundUser.toObject(), secret, { expiresIn: "1d" });
      
      // ✅ FIXED: Now sending 'data' (user object) so frontend can save it to localStorage
      res.status(200).json({
        message: "Login Success",
        token: token,
        role: foundUser.role,
        data: foundUser // This provides the _id needed for offers
      });
    } else {
      res.status(401).json({ message: "Invalid Credentials" });
    }
  } catch (err) {
    res.status(500).json({ message: "Server error during login", err: err.message });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const user = await userSchema.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({
      message: "Profile fetched successfully",
      data: user,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error fetching profile",
      err: err.message,
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await userSchema.find();
    res.status(200).json({
      message: "Users fetched successfully",
      data: users,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error while fetching users",
      err: err.message,
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const updatedUser = await userSchema.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).select("-password");

    res.status(200).json({
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error while updating user",
      err: err.message,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    await userSchema.findByIdAndDelete(req.params.id);
    res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: "Error while deleting user",
      err: err.message,
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile, 
  getAllUsers,
  updateUser,
  deleteUser,
};