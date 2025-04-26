const db = require('../models/db');
const axios = require('axios');
require('dotenv').config();

exports.chat = async (req, res) => {
  try {
    const { userId, message, conversationId } = req.body;

    if (!userId || !message) {
      return res.status(400).json({ error: 'userId and message are required' });
    }

    let convId = conversationId;

    // Create new conversation if no conversationId
    if (!conversationId) {
      const conv = await db.query(
        'INSERT INTO conversations (user_id) VALUES ($1) RETURNING id',
        [userId]
      );
      convId = conv.rows[0].id;
    }

    // Save user message
    await db.query(
      'INSERT INTO messages (conversation_id, sender, content) VALUES ($1, $2, $3)',
      [convId, 'user', message]
    );

    // Call Hugging Face API
    const response = await axios.post(
      process.env.HUGGINGFACE_API,
      { inputs: message },
      { headers: { Authorization: `Bearer ${process.env.HUGGINGFACE_TOKEN}` } }
    );

    let botReply = 'معاف کریں، میں آپ کی بات نہیں سمجھ سکا۔'; // default reply

    if (response.data) {
      if (Array.isArray(response.data)) {
        botReply = response.data[0]?.generated_text || botReply;
      } else {
        botReply = response.data.generated_text || botReply;
      }
    }

    // Save bot reply
    await db.query(
      'INSERT INTO messages (conversation_id, sender, content) VALUES ($1, $2, $3)',
      [convId, 'bot', botReply]
    );

    return res.json({ reply: botReply, conversationId: convId });

  } catch (error) {
    console.error('Chat error:', error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
