const express = require('express');
const router = express.Router();
const {
    continueChat,
    getChatById,
    getChatsByUserId,
    deleteChat,
} = require('../controllers/chatController');

// Create or continue a chat
router.post('/', continueChat);

// Get a specific chat by chatId
router.get('/:chatId', getChatById);

// Get all chats for a specific user
router.get('/user/:userId', getChatsByUserId);

// Delete a specific chat
router.delete('/:chatId', deleteChat);

module.exports = router;
