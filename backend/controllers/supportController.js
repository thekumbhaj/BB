const SupportChat = require('../models/SupportChat');
const geminiService = require('../services/geminiService');

const chat = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ message: 'Message is required' });
    }

    // Save the user message
    await SupportChat.create({
      userId: req.user._id,
      message: message.trim(),
      role: 'user',
    });

    // Fetch last 10 messages for context (excluding the one just saved)
    const recentMessages = await SupportChat.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    // Reverse to get chronological order; last item is the current user message
    recentMessages.reverse();

    // Build history for Gemini (all messages except the latest user message)
    const history = recentMessages.slice(0, -1).map((msg) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: msg.message,
    }));

    // Call Gemini
    const responseText = await geminiService.chat(history, message.trim());

    // Save assistant response
    const assistantMessage = await SupportChat.create({
      userId: req.user._id,
      message: responseText,
      role: 'assistant',
    });

    return res.status(200).json({
      response: responseText,
      message: assistantMessage,
    });
  } catch (error) {
    console.error('Support chat error:', error);
    return res.status(500).json({ message: 'Server error during support chat' });
  }
};

const getChatHistory = async (req, res) => {
  try {
    const messages = await SupportChat.find({ userId: req.user._id })
      .sort({ createdAt: 1 });

    return res.status(200).json({ messages });
  } catch (error) {
    console.error('Get chat history error:', error);
    return res.status(500).json({ message: 'Server error while fetching chat history' });
  }
};

module.exports = { chat, getChatHistory };
