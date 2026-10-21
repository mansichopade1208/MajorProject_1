
import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

const router = express.Router();

// ==================== SIGNUP API ====================
router.post("/signup", async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      password,
      role,
      dateOfBirth,
      gender,
      bloodGroup,
      city,
      address,
      medicalRegistrationNumber,
      specialization,
    } = req.body;

    // Validate required fields
    if (!fullName || !email || !phone || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required fields.",
      });
    }

    // Validate role
    if (!["patient", "doctor"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid account role.",
      });
    }

    // Validate password
    if (typeof password !== "string" || password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters.",
      });
    }

    // Validate patient-specific fields
    if (
      role === "patient" &&
      (!dateOfBirth || !gender || !bloodGroup || !city || !address)
    ) {
      return res.status(400).json({
        success: false,
        message: "Please complete all required patient fields.",
      });
    }

    // Validate doctor-specific fields
    if (
      role === "doctor" &&
      (!medicalRegistrationNumber || !specialization)
    ) {
      return res.status(400).json({
        success: false,
        message: "Please complete all required doctor fields.",
      });
    }

    // Normalize email
    const normalizedEmail = email.trim().toLowerCase();

    // Check whether account already exists
    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create base user data
    const userData = {
      fullName: fullName.trim(),
      email: normalizedEmail,
      phone: phone.trim(),
      password: hashedPassword,
      role,
    };

    // Add role-specific information
    if (role === "patient") {
      Object.assign(userData, {
        dateOfBirth,
        gender,
        bloodGroup,
        city,
        address,
      });
    } else {
      Object.assign(userData, {
        medicalRegistrationNumber,
        specialization,
      });
    }

    // Save user in database
    const user = await User.create(userData);

    return res.status(201).json({
      success: true,
      message: "Registration successful!",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    console.error("Signup error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Registration failed. Please try again.",
    });
  }
});

// ==================== LOGIN API ====================

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email and password only
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please enter your email and password.",
      });
    }

    if (
      typeof email !== "string" ||
      typeof password !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Find user by email
    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail,
    }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Verify password
    const passwordMatches = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Return the role saved in MongoDB
    return res.status(200).json({
      success: true,
      message: "Login successful!",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Login failed. Please try again.",
    });
  }
});


export default router;
