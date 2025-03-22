const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const upload = require('../middleware/upload');

// Register User with optional file upload for lawyers
router.post(
  '/register',
  upload.single('verificationDocument'),
  async (req, res) => {
    const {
      fullName,
      email,
      phone,
      location,
      password,
      userType,
      specialization,
      experience,
      licenseNumber,
    } = req.body;

    try {
      let user = await User.findOne({ email });
      if (user) return res.status(400).json({ message: 'User already exists' });

      if (userType === 'LAWYER' && licenseNumber) {
        const existingLicense = await User.findOne({ licenseNumber });
        if (existingLicense)
          return res
            .status(400)
            .json({ message: 'License number already in use' });
      }

      user = new User({
        fullName,
        email,
        phone,
        location,
        password,
        userType,
        ...(userType === 'LAWYER' && {
          specialization,
          experience,
          licenseNumber,
          verificationDocument: req.file ? req.file.path : null,
        }),
      });

      await user.save();

      const payload = { userId: user._id };
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });

      res.status(201).json({ token });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
);

// Login User (unchanged)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await user.matchPassword(password);
    if (!isMatch)
      return res.status(400).json({ message: 'Invalid credentials' });

    const payload = { userId: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Verify Lawyer
router.put('/verify-lawyer/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || user.userType !== 'LAWYER') {
      return res.status(404).json({ message: 'Lawyer not found' });
    }

    user.isVerified = true;
    await user.save();

    res.json({ message: 'Lawyer verified successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

module.exports = router;
