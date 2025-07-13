import express from 'express';
import * as chat from '../controllers/chatController.js';

const router = express.Router();

router.post('/save-message', chat.saveMessage);
router.post('/new-conversation', chat.newConversation);
router.post('/bot-reply', chat.getBotResponse);
router.post('/history', chat.getChatHistory);
router.delete('/:chatId', chat.deleteChat);
router.get('/messages/:chatId', chat.getChatMessages);

export default router;
