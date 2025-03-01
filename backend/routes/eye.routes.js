import express from "express";
import EyeData from "../models/eyeDataSchema.models.js";
import User from "../models/user.model.js";

const router = express.Router();

/**
 * @route   POST /api/users/register
 * @desc    Register a new user with iris scan data
 * @access  Public
 */
router.post("/users/register", async (req, res) => {
  try {
    const { name, email, irisData, upiId } = req.body;

    // Check if email or UPI ID is already registered
    const existingUser = await User.findOne({ $or: [{ email }, { upiId }] });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email or UPI ID already exists" });
    }

    // Create and save new user
    const newUser = new User({ name, email, irisData, upiId, balance: 1000 });
    await newUser.save();

    res.status(201).json({ success: true, message: "User registered successfully", user: newUser });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/**
 * @route   GET /api/users/get-user/:email
 * @desc    Fetch user details by email
 * @access  Public
 */
router.get("/users/get-user/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/**
 * @route   POST /api/eye/register
 * @desc    Register eye scan data for a user
 * @access  Public
 */
router.post("/eye/register", async (req, res) => {
  try {
    const { userId, irisHash, eyeMovementPattern } = req.body;
    const existingData = await EyeData.findOne({ user: userId });

    if (existingData) {
      return res.status(400).json({ success: false, message: "Eye data already registered" });
    }

    const eyeData = new EyeData({ user: userId, irisHash, eyeMovementPattern });
    await eyeData.save();

    res.status(201).json({ success: true, message: "Eye scan registered successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @route   POST /api/eye/save-data
 * @desc    Save eye scan data
 * @access  Public
 */
router.post("/eye/save-data", async (req, res) => {
  try {
    const { userId, irisHash, eyeMovementPattern } = req.body;
    const existingData = await EyeData.findOne({ user: userId });

    if (existingData) {
      return res.status(400).json({ success: false, message: "User already registered!" });
    }

    const eyeData = new EyeData({ user: userId, irisHash, eyeMovementPattern });
    await eyeData.save();

    res.status(201).json({ success: true, message: "Eye data registered successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @route   POST /api/eye/verify
 * @desc    Verify user's eye scan
 * @access  Public
 */
router.post("/eye/verify", async (req, res) => {
  try {
    const { userId, irisHash, eyeMovementPattern } = req.body;
    const userEyeData = await EyeData.findOne({ user: userId });

    if (!userEyeData) {
      return res.status(404).json({ success: false, message: "No registered eye scan found!" });
    }

    if (userEyeData.irisHash === irisHash && userEyeData.eyeMovementPattern === eyeMovementPattern) {
      res.status(200).json({ success: true, message: "Authentication Successful!" });
    } else {
      res.status(401).json({ success: false, message: "Eye Scan does not match" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
