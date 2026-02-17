const express = require('express');
const router = express.Router();  // ← This line is missing!
const Ticket = require('../models/Ticket');
const { authenticate, requireRole } = require('../middleware/auth');

// Helper function to generate ticket ID
async function generateTicketId() {
    try {
        const count = await Ticket.countDocuments();
        return 'TKT-' + String(count + 1).padStart(3, '0');
    } catch (error) {
        // Fallback to timestamp-based ID
        return 'TKT-' + Date.now().toString().slice(-6);
    }
}

// Get all tickets
router.get('/', authenticate, requireRole('support'), async (req, res) => {
    try {
        const tickets = await Ticket.find().sort({ createdAt: -1 });
        res.json(tickets);
    } catch (error) {
        console.error('Error fetching tickets:', error);
        res.status(500).json({ message: error.message });
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

/// Create new ticket
router.post('/', authenticate, async (req, res) => {
    try {
        const { title, description, category, priority } = req.body;
        
        // Generate a simple ticket ID
        const count = await Ticket.countDocuments();
        const ticketId = 'TKT-' + String(count + 1).padStart(3, '0');
        
        const ticket = new Ticket({
            ticketId,
            title,
            description,
            category,
            priority,
            createdBy: req.user.name,
            createdByEmail: req.user.email,
            // Let the schema handle timestamps
        });
        
        const newTicket = await ticket.save();
        res.status(201).json(newTicket);
    } catch (error) {
        console.error('Error creating ticket:', error);
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
        console.log('='.repeat(60));
        console.log('🔧 ASSIGN ROUTE CALLED');
        console.log('📌 Ticket ID:', req.params.id);
        console.log('👤 User:', req.user);
        console.log('='.repeat(60));

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
        
        console.log('✅ Ticket assigned successfully to:', req.user.name);

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
        console.error('Stack:', error.stack);
        res.status(500).json({ 
            message: 'Server error',
            error: error.message 
        });
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
        
        res.json({ 
            success: true,
            message: 'Ticket resolved successfully'
        });
    } catch (error) {
        console.error('Error resolving ticket:', error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;  // ← Make sure this is at the end