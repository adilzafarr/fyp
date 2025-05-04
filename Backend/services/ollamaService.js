// services/ollamaService.js
const axios = require('axios');

const OLLAMA_BASE_URL = 'http://127.0.0.1:11434'; // change if deployed remotely
const MODEL_NAME = 'humdum'; // or whatever model you're using

exports.sendToOllama = async (userPrompt) => {
  try {
    const response = await axios.post(`${OLLAMA_BASE_URL}/api/chat`, {
      model: MODEL_NAME,
      "messages": [
        {
          "role": "user",
          "content": userPrompt
        }
      ],
      stream: false // or true if you want streaming (requires handling)
    });

    return response.data.message;
  } catch (error) {
    console.error('Ollama error:', error.message);
    throw new Error('Failed to get response from Ollama');
  }
};
