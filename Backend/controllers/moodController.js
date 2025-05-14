const moodModel = require('../models/moodModel');

exports.getMoodHistory = async (req, res) => {
    try{
        const { userId } = req.body;
        const response = await moodModel.getMoodHistory(userId);
        res.json(response);
        
    }
    catch(error){
        console.error('Mood history error:', error.message);
        res.status(500).json({ error: 'Failed to get mood history' });
    }
};