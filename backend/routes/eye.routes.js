import express from "express";
import EyeData from "../models/eyeDataSchema.models.js";

const router = express.Router();

// Register eye scan
router.post("/register-eye", async (req, res) => {
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
    res.status(500).json({ success: false, error: error.message });
  }
});

// ✅ Save Eye Scan Data
router.post("/save-eye-data", async (req, res) => {
  try {
    const { userId, irisHash, eyeMovementPattern } = req.body;
    const existingData = await EyeData.findOne({ user: userId });

    if (existingData) {
      return res.status(400).json({ success: false, message: "User already registered!" });
    }

    const eyeData = new EyeData({ user: userId, irisHash, customEyeMovementPattern: eyeMovementPattern });
    await eyeData.save();
    res.status(201).json({ success: true, message: "Eye data registered successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ✅ Verify Eye Scan
router.post("/verify-eye", async (req, res) => {
  try {
    const { userId, irisHash, eyeMovementPattern } = req.body;
    const userEyeData = await EyeData.findOne({ user: userId });

    if (!userEyeData) {
      return res.status(404).json({ success: false, message: "No registered eye scan found!" });
    }

    if (userEyeData.irisHash === irisHash && userEyeData.customEyeMovementPattern === eyeMovementPattern) {
      res.status(200).json({ success: true, message: "Authentication Successful!" });
    } else {
      res.status(401).json({ success: false, message: "Eye Scan does not match" });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
