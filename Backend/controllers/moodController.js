import * as moodModel from '../models/moodModel.js';

export const getMoodHistory = async (req, res) => {
    try{
        const { userId } = req.body;
        console.log('Received request for userId:', userId);
        
        if (!userId) {
            console.log('No userId provided in request');
            return res.status(400).json({ error: 'userId is required' });
        }

        const response = await moodModel.getMoodHistory(userId);
        console.log('Mood history response:', response);
        
        res.json(response);
    }
    catch(error){
        console.error('Mood history error:', error.message);
        res.status(500).json({ error: 'Failed to get mood history' });
    }
};