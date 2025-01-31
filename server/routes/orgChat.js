// /api/v1/orgChat
const express = require('express');
const router = express.Router();
const { continueOrgChat, getChatByOrg } = require('../controllers/orgChatController');

// Create or continue a chat
router.post('/', continueOrgChat);

// Get all chats by orgId
router.get('/:orgId', getChatByOrg);

module.exports = router;
