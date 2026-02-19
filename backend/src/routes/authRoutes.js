const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require('crypto');
const User = require("../models/User");
const sendEmail = require("../utils/email"); // Note: Ensure this matches your export in email.js

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me";

console.log("🔥🔥🔥 AUTH ROUTES LOADED 🔥🔥🔥");

// --- REGISTER ---
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role, adminCode } = req.body;

        // 1. Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        // 2. SPECIAL ADMIN LOGIC
        if (role === 'admin') {
            // Check the secret code
            if (adminCode !== "8722") {
                return res.status(403).json({ message: 'Invalid Admin Registration Code' });
            }

            // Check if there are already 3 admins
            const adminCount = await User.countDocuments({ role: 'admin' });
            if (adminCount >= 3) {
                return res.status(403).json({ message: 'Maximum number of admins (3) reached' });
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword, role });
        await user.save();
        
        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
        res.status(201).json({ token, user: { id: user._id, name: user.name, role: user.role } });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// --- LOGIN ---
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: 'Invalid credentials' });
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });
        
        const token = jwt.sign({ id: user._id, name: user.name, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
        
        res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// --- FORGOT PASSWORD ---
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email });
    // For security, don't confirm if user exists
    if (!user) {
      return res.json({ message: "If an account exists, a reset link has been sent." });
    }

    // Generate crypto token
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Save token & expiry to database
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    const frontendBase = process.env.FRONTEND_URL || "http://localhost:5173";
    const resetLink = `${frontendBase}/reset-password/${resetToken}`;

    // Send the actual email
    try {
        await sendEmail({
            email: user.email,
            subject: "SupportSync - Password Reset",
            message: `You requested a password reset. Click the link below to set a new password:\n\n${resetLink}\n\nThis link expires in 1 hour.`
        });
        
        console.log("DEBUG: Reset link generated ->", resetLink);
        res.json({ message: "If an account exists, a reset link has been sent." });
    } catch (mailErr) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
        res.status(500).json({ message: "Error sending email. Please try again later." });
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// --- RESET PASSWORD (:token) ---
router.post('/reset-password/:token', async (req, res) => {
  try {
    const { password } = req.body;

    // Find user with valid token that hasn't expired
    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired link." });
    }

    // Hash the new password and save
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    
    // Clear reset fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    
    await user.save();

    res.status(200).json({ message: "Success! Password updated. You can now log in." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;