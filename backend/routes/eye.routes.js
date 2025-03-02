import express from "express";
import EyeData from "../models/eyeDataSchema.models.js";
import User from "../models/user.models.js";
import Vendor from "../models/vendor.models.js";
const router = express.Router();

/**
 * @route   POST /vendor/register
 * @desc    Register a new vendor
 * @access  Public
 */
router.post("/vendors/register", async (req, res) => {
  try {
    const { name, email, phone, businessName, upiId, bankAccount, irisData } = req.body;

    if (!name || !email || !phone || !businessName || !upiId || !bankAccount || !irisData) {
      return res.status(400).json({ success: false, message: "All fields including iris scan are required" });
    }

    // Check if vendor already exists
    const existingVendor = await Vendor.findOne({ $or: [{ email }, { phone }] });
    if (existingVendor) {
      return res.status(400).json({ success: false, message: "Vendor with this email or phone already exists" });
    }

    // Create new vendor
    const newVendor = new Vendor({
      name,
      email,
      phone,
      businessName,
      upiId,
      bankAccount,
      irisData, // Store scanned iris data
    });

    await newVendor.save();
    res.status(201).json({ success: true, message: "Vendor registered successfully!", vendor: newVendor });

  } catch (error) {
    console.error("Vendor Registration Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});




/**
 * @route   POST /api/users/register
 * @desc    Register a new user with iris scan data
 * @access  Public
 */
router.post("/users/register", async (req, res) => {
  try {
    const { name, email, irisData, upiId } = req.body;

    // 1️⃣ Validate required fields
    if (!name || !email || !irisData || !upiId) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // 2️⃣ Validate irisData structure
    if (
      !irisData.leftIris ||
      !irisData.rightIris ||
      !Array.isArray(irisData.leftIris) ||
      !Array.isArray(irisData.rightIris)
    ) {
      return res.status(400).json({ success: false, message: "Invalid irisData format" });
    }

    // 3️⃣ Check if email or UPI ID is already registered
    const existingUser = await User.findOne({ $or: [{ email }, { upiId }] });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User with this email or UPI ID already exists" });
    }

    // 4️⃣ Create and save new user
    const newUser = new User({ name, email, irisData, upiId, balance: 1000 });
    await newUser.save();

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: newUser,
    });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ success: false, message: error.message });
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

router.post("/scan-eye", async (req, res) => {
  try {
      console.log("Received request at /scan-eye");

      // Log full request body for debugging
      console.log("Request Body:", req.body);

      const { eyeScanData } = req.body; // Receive eye scan data

      if (!eyeScanData) {
          console.log("❌ Missing eyeScanData in request.");
          return res.status(400).json({ message: "Eye scan data is required." });
      }

      console.log("🔍 Searching for user with eye scan data...");

      // Match the scanned eye data with the database
      const user = await User.findOne({ eyeScan: eyeScanData });

      if (!user) {
          console.log("❌ No matching user found.");
          return res.status(404).json({ message: "User not found." });
      }

      console.log("✅ User found:", { id: user._id, name: user.name });

      // If match found, return user details (exclude sensitive info)
      res.json({
          success: true,
          user: {
              id: user._id,
              name: user.name,
              upiId: user.upiId, // Linked payment method
              balance: user.balance,
          },
      });

  } catch (error) {
      console.error("🔥 Error authenticating eye scan:", error);
      res.status(500).json({ message: "Internal Server Error" });
  }
});


router.post("/vendor/register", async (req, res) => {
  try {
    // const { name, email, irisData, upiId } = req.body;
    const {name,email,phone,businessName,upiId,bankAccount,transactions} = req.body;

    // 1️⃣ Validate required fields
    if (!name || !email || !irisData || !upiId) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // 2️⃣ Validate irisData structure
    if (
      !irisData.leftIris ||
      !irisData.rightIris ||
      !Array.isArray(irisData.leftIris) ||
      !Array.isArray(irisData.rightIris)
    ) {
      return res.status(400).json({ success: false, message: "Invalid irisData format" });
    }

    // 3️⃣ Check if email or UPI ID is already registered
    const existingUser = await User.findOne({ $or: [{ email }, { upiId }] });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User with this email or UPI ID already exists" });
    }

    // 4️⃣ Create and save new user
    const newUser = new User({ name, email, irisData, upiId, balance: 1000 });
    await newUser.save();

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: newUser,
    });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
