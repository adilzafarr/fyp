import axios from 'axios';

const CLASSIFICATION_API_URL = 'http://127.0.0.1:3001/classify'; 

export const classifyMessage = async (messageText) => {
    try {
        const response = await axios.post(CLASSIFICATION_API_URL, { text: messageText });
        return response.data.predicted_class;
    } catch (error) {
        console.error('Error calling classification API:', error.message);
        // Depending on requirements, you might want to re-throw, return a default, or handle differently
        throw new Error('Failed to classify message: ' + error.message);
    }
};