const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const ChatSchema = new mongoose.Schema({
    chatId: {
        type: String,
        default: uuidv4,
        required: true
    },
    orgId: {
        type: String,  // Changed from ObjectId to String to match Organization's OrgId
        required: false
    },
    contextId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Context',
        required: function () {
            return !this.orgId; // Required if no orgId is provided (temporary chat)
        }
    },
    messages: [{
        sender: {
            type: String, // "userId"
            required: true
        },
        message: {
            type: String,
            required: true
        },
        response:{
            type: String,
            required: true
        },
        timestamp: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('OrgChat', ChatSchema);
