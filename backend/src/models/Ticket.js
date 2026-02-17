const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    ticketId: {
        type: String,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Open', 'In Progress', 'Resolved'],
        default: 'Open'
    },
    priority: {
        type: String,
        enum: ['High', 'Medium', 'Low'],
        default: 'Medium'
    },
    category: {
        type: String,
        enum: ['Authentication', 'Bug', 'Feature', 'UI/UX', 'Performance', 'Database', 'Hardware', 'Network', 'Other'],
        default: 'Other'
    },
    assignedTo: {
        type: String,
        default: null
    },
    createdBy: {
        type: String,
        required: true
    },
    createdByEmail: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true // This automatically handles createdAt and updatedAt
});

// Remove ALL middleware - let MongoDB handle timestamps
// No pre-save hooks at all

const Ticket = mongoose.model('Ticket', ticketSchema);
module.exports = Ticket;