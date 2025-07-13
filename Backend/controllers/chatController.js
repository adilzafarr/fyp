import * as chatModel from '../models/chatModel.js';
import { sendToOllama } from '../services/ollamaService.js';
import { classifyMessage } from '../services/classificationService.js';

export const saveMessage = async (req, res) => {
  try {
    const { userId, conversationId, sender, text, timestamp } = req.body;

    if (!conversationId || !sender || !text || !timestamp) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const messageId = await chatModel.saveMessage(conversationId, sender, text, timestamp, userId, -1); // Pass -1 as initial emotion

    // Only classify if the sender is not 'bot'
    if (sender !== 'bot') {
      classifyMessage(text)
        .then(async (classificationResult) => {
          // Update the message with the classification result
          await chatModel.updateMessageEmotion(messageId, classificationResult);
          console.log(`Message ${messageId} classified as: ${classificationResult}`);
        })
        .catch((classificationError) => {
          console.error(`Error classifying message ${messageId}:`, classificationError.message);
          // Optionally handle failure
        });
    } else {
      console.log(`Skipping classification for message ${messageId} from bot.`);
    }

    return res.status(201).json({ message: 'Message saved successfully and classification (if applicable) initiated' });
  } catch (error) {
    console.error('Chat error:', error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
};


export const newConversation = async (req, res) => {
  try {
    const { userId } = req.body;
    const response = await chatModel.newConversation(userId);
    return res.json({ convID: response });
  } catch (error) {
    console.error('Chat error:', error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getBotResponse = async (req, res) => {
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

export const getChatHistory = async (req, res) => {
  console.log('Received request to get chat history.');
  try {
    const { userId } = req.body;
    console.log('Fetching chat history for userId:', userId);

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required.' });
    }

    // Call the model function to get chat history (will implement next)
    const chatHistory = await chatModel.getChatHistory(userId);

    res.status(200).json(chatHistory);

  } catch (error) {
    console.error('Error fetching chat history in controller:', error);
    res.status(500).json({ error: 'Failed to fetch chat history.' });
  }
};

export const deleteChat = async (req, res) => {
  console.log('Received request to delete chat.');
  try {
    const { chatId } = req.params; // Extract chatId from route parameters
    console.log('Deleting chat with ID:', chatId);

    if (!chatId) {
      return res.status(400).json({ error: 'Chat ID is required.' });
    }

    // Call the model function to delete the chat (will implement next)
    await chatModel.deleteChat(chatId);

    res.status(200).json({ message: 'Chat deleted successfully.' });

  } catch (error) {
    console.error('Error deleting chat in controller:', error);
    res.status(500).json({ error: 'Failed to delete chat.' });
  }
};

export const getChatMessages = async (req, res) => {
    console.log('Received request to get chat messages.');
    try {
        const { chatId } = req.params; // Extract chatId from route parameters
        console.log('Fetching messages for chat ID:', chatId);

        if (!chatId) {
            return res.status(400).json({ error: 'Chat ID is required.' });
        }

        // Call the model function to get chat messages
        const messages = await chatModel.loadChat(chatId);

        res.status(200).json(messages);

    } catch (error) {
        console.error('Error fetching chat messages in controller:', error);
        res.status(500).json({ error: 'Failed to fetch chat messages.' });
    }
};
export const getClassification = async (req, res) =>{
  
}