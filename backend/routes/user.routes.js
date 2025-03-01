import express from 'express';
import User from '../models/user.model.js';

const router = express.Router();

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { name, email, upiId, irisData } = req.body;

    // Validate input
    if (!name || !email || !upiId || !irisData || !irisData.leftIris || !irisData.rightIris) {
      return res.status(400).json({ message: 'All fields (including iris data) are required!' });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already registered!' });
    }

    // Create new user
    const newUser = new User({ name, email, upiId, irisData, balance: 1000 });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
});

export default router;
