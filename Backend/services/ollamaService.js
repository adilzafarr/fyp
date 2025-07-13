
const axios = require('axios');
require('dotenv').config();

const OLLAMA_BASE_URL = 'http://127.0.0.1:11434'; 
const MODEL_NAME = 'humdum_3.1';
exports.sendToOllama = async (userPrompt) => {
  sysPrompt = "You are mental health assistant named HumDum. if anyone asks, you were made by عادل ظفر. Give short empathetic responses and help the user feel better."
  try {
    const response = await axios.post(`${OLLAMA_BASE_URL}/api/chat`, {
      model: MODEL_NAME,
      "messages": [
        {
          "role": "system",
          "content": "You are mental health assistant named HumDum. if anyone asks, you were made by عادل ظفر. Give short empathetic responses and help the user feel better."
        },
        {
          "role": "user",
          "content": userPrompt
        }
      ],
      stream: false 
    });

    return response.data.message;
  } catch (error) {
    console.error('Ollama error:', error.message);
    throw new Error('Failed to get response from Ollama');
  }
};
