const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authMiddleware = require("../middleware/auth");
const multer = require("multer");
const path = require("path");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /pdf|doc|docx/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error("Only PDF, DOC, and DOCX files are allowed"));
  },
});

// Sign Up
router.post(
  "/signup",
  upload.single("verificationDocument"),
  async (req, res) => {
    try {
      const {
        name,
        email,
        phone,
        location,
        password,
        role,
        specialization,
        experience,
        licenseNumber,
      } = req.body;

      // Validate required fields
      if (!name || !email || !phone || !location || !password || !role) {
        return res
          .status(400)
          .json({ message: "All required fields must be provided" });
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email format" });
      }

      // Validate password length
      if (password.length < 7) {
        return res
          .status(400)
          .json({ message: "Password must be at least 7 characters long" });
      }

      // Validate role
      if (!["CITIZEN", "LAWYER"].includes(role)) {
        return res.status(400).json({ message: "Must be CITIZEN or LAWYER" });
      }

      // Validate lawyer-specific fields if role is LAWYER
      if (role === "LAWYER") {
        if (!specialization || !experience || !licenseNumber) {
          return res.status(400).json({
            message:
              "Specialization, experience, and license number are required for lawyers",
          });
        }
        if (!req.file) {
          return res
            .status(400)
            .json({ message: "Verification document is required for lawyers" });
        }
      }

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User Already Exist." });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create new user
      const user = new User({
        name,
        email,
        phone,
        location,
        password: hashedPassword,
        role,
        ...(role === "LAWYER" && {
          specialization,
          experience: parseInt(experience),
          licenseNumber,
          verificationDocument: req.file ? req.file.path : undefined,
          isVerified: false,
        }),
      });

      await user.save();

      // Generate JWT token
      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "2h" }
      );

      // Send response
      res.status(201).json({
        token,
        user: {
          fid: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      console.error("Error in /api/auth/signup:", error.message, error.stack);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Sign In
router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email or password are not corrrect!" });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User Not Found!" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password!" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    // Send response
    res.json({
      token,
      user: {
        fid: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error in /api/auth/signin:", error.message, error.stack);
    res.status(500).json({ message: "Server error" });
  }
});

// Get User Profile (GET /api/auth/profile)
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user).select("name email role");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({
      user: {
        fid: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error in /api/auth/profile:", error.message, error.stack);
    res.status(500).json({ message: "Server error" });
  }
});

// Logout
router.post("/logout", authMiddleware, async (req, res) => {
  try {
    res.json({ message: "Logged out successfully", action: "clearToken" });
  } catch (error) {
    console.error("Error in /api/auth/logout:", error.message, error.stack);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
