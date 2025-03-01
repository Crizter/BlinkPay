import User from '../models/user.models.js';

const register = async (req, res) => {
  try {
    const { name, email, phone, upiId, bankAccount } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { phone }] 
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email or phone already exists"
      });
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      phone,
      upiId,
      bankAccount
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export { register };
