const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Ticket = require('../models/Ticket');
// You'll need a middleware to check if the user is an admin here

// Get all users (Admin only)
router.get('/users', async (req, res) => {
    const users = await User.find().select('-password');
    res.json(users);
});

// Delete any user (Admin only)
router.delete('/users/:id', async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User removed from system" });
});

// Delete any ticket (Admin only)
router.delete('/tickets/:id', async (req, res) => {
    await Ticket.findByIdAndDelete(req.params.id);
    res.json({ message: "Ticket deleted" });
});

// Get all tickets from everyone (Admin only)
router.get('/tickets', async (req, res) => {
    try {
        const tickets = await Ticket.find().populate('createdBy', 'name');
        res.json(tickets);
    } catch (err) {
        res.status(500).json({ message: "Error fetching tickets" });
    }
});

module.exports = router;