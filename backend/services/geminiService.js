const { getGeminiModel } = require('../config/gemini');

/**
 * Send a message to Gemini with conversation history.
 * @param {Array<{role: string, parts: string}>} history - Previous messages
 * @param {string} userMessage - The latest user message
 * @returns {Promise<string>} The assistant's response text
 */
const chat = async (history, userMessage) => {
  const model = getGeminiModel();

  const chatSession = model.startChat({
    history: history.map((msg) => ({
      role: msg.role,
      parts: [{ text: msg.parts }],
    })),
  });

  const result = await chatSession.sendMessage(userMessage);
  const response = await result.response;
  return response.text();
};

module.exports = { chat };
