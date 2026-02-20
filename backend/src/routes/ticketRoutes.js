const express = require('express');
const router = express.Router(); 
const multer = require('multer');
const Ticket = require('../models/Ticket');
const { authenticate, requireRole } = require('../middleware/auth');

//MULTER CONFIG
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// Helper function to generate ticket ID
async function generateTicketId() {
    try {
        const count = await Ticket.countDocuments();
        return 'TKT-' + String(count + 1).padStart(3, '0');
    } catch (error) {
        return 'TKT-' + Date.now().toString().slice(-6);
    }
}

// Get all tickets for support agents
router.get('/', authenticate, requireRole('support'), async (req, res) => {
    try {
        const tickets = await Ticket.find().sort({ createdAt: -1 });
        res.json(tickets);
    } catch (error) {
        console.error('Error fetching tickets:', error);
        res.status(500).json({ message: error.message });
    }
});

// Get all tickets for user dashboard - specific user
router.get('/my-tickets/:email', authenticate, async (req, res) => {
    try {
        const requestedEmail = req.params.email;
        const loggedInUser = req.user;

        if (loggedInUser.role !== 'support' && loggedInUser.email !== requestedEmail) {
            return res.status(403).json({ 
                message: "Access denied. You can only view your own tickets." 
            });
        }

        const tickets = await Ticket.find({ createdByEmail: requestedEmail })
                                    .sort({ createdAt: -1 });
        
        res.json(tickets);
    } catch (error) {
        console.error('Error fetching user tickets:', error);
        res.status(500).json({ message: "Server error while fetching tickets" });
    }
});

// Get single ticket
router.get('/:id', authenticate, async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id);
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }
        res.json(ticket);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// --- UPDATED CREATE ROUTE WITH MULTER ---
router.post('/', authenticate, upload.single('attachment'), async (req, res) => {
    try {
        // req.body is populated by multer now
        const { title, description, category, priority } = req.body;
        
        let ticketId;
        let isUnique = false;
        let attempts = 0;
        const maxAttempts = 10;
        
        while (!isUnique && attempts < maxAttempts) {
            const count = await Ticket.countDocuments();
            ticketId = 'TKT-' + String(count + 1 + attempts).padStart(3, '0');
            const existingTicket = await Ticket.findOne({ ticketId });
            if (!existingTicket) {
                isUnique = true;
            }
            attempts++;
        }
        
        if (!isUnique) {
            ticketId = 'TKT-' + Date.now().toString().slice(-6) + '-' + Math.floor(Math.random() * 100);
        }
        
        const ticket = new Ticket({
            ticketId,
            title,
            description,
            category,
            priority,
            createdBy: req.user.name,
            createdByEmail: req.user.email,
        });

        // file attachment
        if (req.file) {
            ticket.attachment = {
                data: req.file.buffer,
                contentType: req.file.mimetype,
                fileName: req.file.originalname
            };
        }
        
        const newTicket = await ticket.save();
        res.status(201).json(newTicket);
    } catch (error) {
        console.error('Error creating ticket:', error);
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Ticket ID conflict. Please try again.' });
        }
        res.status(400).json({ message: error.message });
    }
});

// Update ticket
router.put('/:id', authenticate, requireRole('support'), async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id);
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }
        
        const { title, description, category, priority, status } = req.body;
        
        if (title) ticket.title = title;
        if (description) ticket.description = description;
        if (category) ticket.category = category;
        if (priority) ticket.priority = priority;
        if (status) ticket.status = status;
        
        ticket.updatedAt = new Date();
        
        const updatedTicket = await ticket.save();
        res.json(updatedTicket);
    } catch (error) {
        console.error('Error updating ticket:', error);
        res.status(400).json({ message: error.message });
    }
});

// Assign ticket to agent
router.put('/:id/assign', authenticate, requireRole('support'), async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id);
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        if (ticket.assignedTo) {
            return res.status(400).json({ 
                message: `Ticket is already assigned to ${ticket.assignedTo}` 
            });
        }

        ticket.assignedTo = req.user.name;
        if (ticket.status === 'Open') {
            ticket.status = 'In Progress';
        }
        ticket.updatedAt = new Date();

        await ticket.save();
        res.json({
            success: true,
            message: 'Ticket assigned successfully',
            ticket: {
                _id: ticket._id,
                ticketId: ticket.ticketId,
                title: ticket.title,
                status: ticket.status,
                assignedTo: ticket.assignedTo
            }
        });
    } catch (error) {
        console.error('❌ Error in assign route:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Resolve ticket
router.put('/:id/resolve', authenticate, requireRole('support'), async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id);
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        if (ticket.assignedTo !== req.user.name) {
            return res.status(403).json({ 
                message: 'You can only resolve tickets assigned to you' 
            });
        }

        ticket.status = 'Resolved';
        ticket.updatedAt = new Date();
        
        await ticket.save();
        res.json({ success: true, message: 'Ticket resolved successfully' });
    } catch (error) {
        console.error('Error resolving ticket:', error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
