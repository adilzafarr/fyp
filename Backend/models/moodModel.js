import db from './db.js';

const getMoodHistory = async (userId) => {
    console.log('Querying mood history for userId:', userId);
    try {
        const response = await db.query(`SELECT id, "userId", emotion AS mood, created_at AS date FROM messages WHERE "userId" = $1 AND sender = 'user' ORDER BY date ASC`, [userId]);
        console.log('Database response:', response.rows);
        return response.rows;
    } catch (error) {
        console.error('Database error:', error);
        throw error;
    }
};

export { getMoodHistory };