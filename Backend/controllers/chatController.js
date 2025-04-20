const db = require('../models/db');
const axios = require('axios');
require('dotenv').config();

exports.chat = async (req, res) => {
  const { userId, message, conversationId } = req.body;

  // Create a conversation if not exists
  let convId = conversationId;
  if (!conversationId) {
    const conv = await db.query('INSERT INTO conversations (user_id) VALUES ($1) RETURNING id', [userId]);
    convId = conv.rows[0].id;
  }

  // Save user message
  await db.query('INSERT INTO messages (conversation_id, sender, content) VALUES ($1, $2, $3)', [convId, 'user', message]);

  // Call Hugging Face API
  const response = await axios.post(
    process.env.HUGGINGFACE_API,
    { inputs: message },
    { headers: { Authorization: `Bearer ${process.env.HUGGINGFACE_TOKEN}` } }
  );

  const botReply = response.data.generated_text || 'Sorry, I did not understand that.';

  // Save bot response
  await db.query('INSERT INTO messages (conversation_id, sender, content) VALUES ($1, $2, $3)', [convId, 'bot', botReply]);

  res.json({ reply: botReply, conversationId: convId });
};
