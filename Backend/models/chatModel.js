import db from './db.js';

const saveMessage = async (conversationId, sender, content, created_at, userId, emotion) => {
    const result = await db.query('INSERT INTO messages (conversation_id, sender, content,created_at, "userId", emotion) VALUES ($1, $2, $3, $4,$5,$6) RETURNING id', [conversationId, sender, content,created_at, userId, emotion]);
    return result.rows[0].id;
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

const updateMessageEmotion = async (messageId, emotion) => {
    await db.query('UPDATE messages SET emotion = $1 WHERE id = $2', [emotion, messageId]);
}

// New function to get chat history for a user
const getChatHistory = async (userId) => {
    console.log('Fetching chat history from DB for userId:', userId);
    try {
        // This query joins conversations and messages to get the last message and count for each conversation
        // and selects conversations belonging to the user.
        const queryText = `
            SELECT
                c.id AS conversation_id,
                c.created_at,
                (SELECT content FROM messages WHERE conversation_id = c.id ORDER BY created_at ASC LIMIT 1) AS last_message,
                (SELECT COUNT(*) FROM messages WHERE conversation_id = c.id) AS message_count
            FROM
                conversations c
            WHERE
                c.user_id = $1
            ORDER BY
                c.created_at DESC;
        `;
        const response = await db.query(queryText, [userId]);
        console.log('Chat history data fetched from DB:', response.rows);
        return response.rows;
    } catch (error) {
        console.error('Error fetching chat history from DB:', error);
        throw error; // Re-throw the error to be caught by the controller
    }
};

// New function to delete a chat and its messages
const deleteChat = async (chatId) => {
    console.log('Deleting chat with ID from DB:', chatId);
    try {
        // Start a transaction
        await db.query('BEGIN');

        // Delete messages associated with the conversation
        await db.query('DELETE FROM messages WHERE conversation_id = $1', [chatId]);
        console.log(`Deleted messages for conversation ${chatId}`);

        // Delete the conversation itself
        await db.query('DELETE FROM conversations WHERE id = $1', [chatId]);
        console.log(`Deleted conversation ${chatId}`);

        // Commit the transaction
        await db.query('COMMIT');
        console.log('Chat deletion transaction committed.');

    } catch (error) {
        // Rollback the transaction in case of error
        await db.query('ROLLBACK');
        console.error('Error deleting chat from DB, rolling back transaction:', error);
        throw error; // Re-throw the error
    }
};

export { 
    saveMessage,
    newConversation,
    loadChat,
    getChatHistory,
    deleteChat, // Export the new delete function
    updateMessageEmotion
};