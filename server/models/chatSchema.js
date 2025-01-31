const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const chatSchema = new mongoose.Schema({
    chatId: {
        type: String,
        default: uuidv4,
        required: true,
        unique: true,
    },
    userId: {
        type: String,
        required: true,
    },
    messages: [
        {
            message: { type: String, required: true },
            response: { type: String, required: true },
            timestamp: { type: Date, default: Date.now },
        },
    ],
}, {
    timestamps: true,
});

module.exports = mongoose.model('Chat', chatSchema);
