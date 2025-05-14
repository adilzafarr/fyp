const db = require('./db');

const getMoodHistory = async (userId) => {
    const response = await db.query('SELECT * FROM mood_history WHERE userid = $1 ORDER BY date ASC', [userId]);
    return response.rows;
};

module.exports = {
    getMoodHistory,
};