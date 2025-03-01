import express from "express";
import EyeData from "../models/eyeDataSchema.models.js";

const router = express.Router();

// POST: Save new eye scan data
router.post("/save-eye-data", async (req, res) => {
  try {
    const { userId, irisHash, eyeMovementPattern } = req.body;
    const eyeData = new EyeData({ user: userId, irisHash, customEyeMovementPattern: eyeMovementPattern });
    await eyeData.save();
    res.status(201).json({ success: true, message: "Eye data saved!" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST: Verify eye scan
router.post("/verify-eye", async (req, res) => {
  try {
    const { userId, irisHash, eyeMovementPattern } = req.body;
    const userEyeData = await EyeData.findOne({ user: userId });

    if (userEyeData && userEyeData.irisHash === irisHash && userEyeData.customEyeMovementPattern === eyeMovementPattern) {
      res.status(200).json({ success: true, message: "Authentication Successful!" });
    } else {
      res.status(401).json({ success: false, message: "Eye Scan does not match" });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;