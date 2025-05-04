const db = require('./db');


const saveMessage = async (conversationId, sender, content, created_at) => {
    await db.query('INSERT INTO messages (conversation_id, sender, content,created_at) VALUES ($1, $2, $3, $4)', [conversationId, sender, content,created_at]);
}
const newConversation = async (userId) => {
    const response = await db.query('INSERT INTO conversations (user_id) VALUES ($1) RETURNING id', [userId]);
    const conversationId = response.rows[0].id;
    return conversationId;
};
const loadChat = async (convID) => {
    const response = await db.query('SELECT sender, content, created_at FROM messages WHERE conversation_id = $1', [convID]);
    return response.rows;
};

module.exports = { 
    saveMessage,
    newConversation,
    loadChat
};