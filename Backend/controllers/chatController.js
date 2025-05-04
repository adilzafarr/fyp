const chatModel = require('../models/chatModel');
const { sendToOllama } = require('../services/ollamaService');

exports.saveMessage = async (req, res) => {
  try {
    const { conversationId, sender, text,timestamp } = req.body;

    if (!conversationId || !sender || !text || !timestamp) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    await chatModel.saveMessage(conversationId, sender, text,timestamp);

    return res.status(201).json({ message: 'Message saved successfully' });

  } catch (error) {
    console.error('Chat error:', error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
};


exports.newConversation = async (req, res) => {
  try {
    const { userId } = req.body;
    const response = await chatModel.newConversation(userId);
    return res.json({ convID: response });
  } catch (error) {
    console.error('Chat error:', error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

exports.getBotResponse = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const botReply = await sendToOllama(message);

    return res.status(200).json({ response: botReply });
  } catch (error) {
    console.error('Bot response error:', error.message);
    return res.status(500).json({ error: 'Failed to get bot response' });
  }
};