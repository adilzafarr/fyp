const express = require('express');
const router = express.Router();
const chat = require('../controllers/chatController');

router.post('/save-message', chat.saveMessage);
router.post('/new-conversation', chat.newConversation);
router.post('/bot-reply', chat.getBotResponse);


module.exports = router;
