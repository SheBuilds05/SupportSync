const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { sendEmail } = require("../utils/email");

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me";

// ADD THIS DEBUG LINE
console.log("🔥🔥🔥 AUTH ROUTES LOADED - CHECKING TOKEN CREATION 🔥🔥🔥");
// Register a new user
// In your register route
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        
        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create user
        const user = new User({
            name,
            email,
            password: hashedPassword,
            role
        });
        
        await user.save();
        
        // CREATE TOKEN WITH ALL FIELDS
        const token = jwt.sign(
            { 
                id: user._id, 
                name: user.name,        // ← ADD THIS
                email: user.email,       // ← ADD THIS
                role: user.role 
            },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );
        
        res.status(201).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Login existing user
// In your login route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        
        // Check password (assuming you're using bcrypt)
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        
        // CREATE TOKEN WITH ALL FIELDS - THIS IS THE FIX!
        const token = jwt.sign(
            { 
                id: user._id, 
                name: user.name,        // ← ADD THIS
                email: user.email,       // ← ADD THIS
                role: user.role 
            },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );
        
        console.log('🔑 Login successful for:', user.name);
        console.log('📦 Token contains:', { name: user.name, email: user.email, role: user.role });
        
        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Simple route to fetch current user (requires auth middleware, we will add later)
router.get("/me", async (req, res) => {
  return res.status(501).json({ message: "Not implemented. Wire with auth middleware." });
});

// Request password reset - sends email with reset link
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });

    // For security, always return success even if user not found
    if (!user) {
      return res.json({
        message: "If an account with that email exists, a reset link has been sent.",
      });
    }

    const resetToken = jwt.sign({ id: user._id }, JWT_SECRET, {
      expiresIn: "1h",
    });

    const frontendBase =
      process.env.FRONTEND_URL || "http://localhost:5173";

    const resetLink = `${frontendBase}/reset-password?token=${encodeURIComponent(
      resetToken
    )}`;

    await sendEmail({
      to: user.email,
      subject: "SupportSync - Password Reset",
      html: `
        <p>Hello ${user.name || ""},</p>
        <p>You requested to reset your SupportSync password.</p>
        <p>Click the link below to set a new password (valid for 1 hour):</p>
        <p><a href="${resetLink}">${resetLink}</a></p>
        <p>If you did not request this, you can ignore this email.</p>
      `,
    });

    res.json({
      message: "If an account with that email exists, a reset link has been sent.",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server error",
      error: err instanceof Error ? err.message : "Unknown error",
    });
  }
});

// Reset password using token
router.post("/reset-password", async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ message: "Token and new password are required" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res.status(400).json({ message: "Invalid or expired reset token" });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password has been reset successfully. You can now log in." });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server error",
      error: err instanceof Error ? err.message : "Unknown error",
    });
  }
});

module.exports = router;

