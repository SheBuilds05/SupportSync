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
    //  Fields to store the file as a Buffer
    attachment: {
        data: {
            type: Buffer
        },
        contentType: {
            type: String
        },
        fileName: {
            type: String
        }
    }
}, {
    timestamps: true // Automatically creates and updates 'createdAt' and 'updatedAt'
});

const Ticket = mongoose.model('Ticket', ticketSchema);
module.exports = Ticket;