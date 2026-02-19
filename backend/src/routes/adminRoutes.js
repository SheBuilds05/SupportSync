const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Ticket = require('../models/Ticket');
const AuditLog = require('../models/AuditLog');

// A helper function to record actions
async function recordAction(action, adminId, details) {
    try {
        await AuditLog.create({ action, performedBy: adminId, details });
    } catch (err) {
        console.error("Failed to save audit log:", err);
    }
}

// Get all users (Admin only)
router.get('/users', async (req, res) => {
    const users = await User.find().select('-password');
    res.json(users);
});

router.get('/logs', async (req, res) => {
    try {
        const logs = await AuditLog.find()
            .populate('performedBy', 'name')
            .sort({ timestamp: -1 }) // Newest logs first
            .limit(50); // Only show the last 50 actions
        res.json(logs);
    } catch (err) {
        res.status(500).json({ message: "Error fetching logs" });
    }
});

// Delete any user (Admin only)
router.delete('/users/:id', async (req, res) => {
    try {
        const userToDelete = await User.findById(req.params.id);
        await User.findByIdAndDelete(req.params.id);
        
        // RECORD THE ACTION HERE
        await recordAction("DELETE_USER", req.user.id, `Deleted user: ${userToDelete.email}`);
        
        res.json({ message: "User deleted successfully" });
    } catch (err) {"Delete Error:", err }
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

// TOOL 1: Update the Secret Admin Code
// Imagine this like changing the password to the secret clubhouse
let secretAdminCode = "8722"; // We start with your current code

router.post('/update-code', (req, res) => {
    const { newCode } = req.body;
    if (!newCode) return res.status(400).json({ message: "New code is required" });
    
    secretAdminCode = newCode; 
    console.log("Clubhouse password changed to:", secretAdminCode);
    res.json({ message: "Admin code updated successfully!" });
});

// TOOL 2: Change a User's Role (Promote or Demote)
// This is like giving someone a badge or taking it away
router.patch('/users/:id/role', async (req, res) => {
    try {
        const { role } = req.body; // 'user', 'support', or 'admin'
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id, 
            { role: role }, 
            { new: true }
        ).select('-password');
        
        res.json(updatedUser);
    } catch (err) {
        res.status(500).json({ message: "Could not change the role" });
    }
});

// TOOL 3: Get Big Stats
router.get('/stats', async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        const ticketCount = await Ticket.countDocuments();
        const openTickets = await Ticket.countDocuments({ status: 'open' });
        
        res.json({
            totalUsers: userCount,
            totalTickets: ticketCount,
            pendingWork: openTickets
        });
    } catch (err) {
        res.status(500).json({ message: "Error fetching stats" });
    }
});

// TOOL 4: Get only the Support Agents
// The Admin needs this list to know who they can give tickets to
router.get('/agents', async (req, res) => {
    try {
        const agents = await User.find({ role: 'support' }).select('name _id');
        res.json(agents);
    } catch (err) {
        res.status(500).json({ message: "Error fetching agents" });
    }
});

// TOOL 5: Reassign a Ticket
// This "hands off" the ticket from one person to another
router.patch('/tickets/:id/reassign', async (req, res) => {
    try {
        const { agentId } = req.body;
        const updatedTicket = await Ticket.findByIdAndUpdate(
            req.params.id,
            { assignedTo: agentId }, // Make sure your Ticket model has an 'assignedTo' field
            { new: true }
        );
        res.json(updatedTicket);
    } catch (err) {
        res.status(500).json({ message: "Error reassigning ticket" });
    }
});

module.exports = router;