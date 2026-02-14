const { generateRAGResponse, translateWithSarvam, speechToText } =
  require("../services/aiService");

exports.chatbotReply = async (req, res) => {
  try {
    const { message, language, history } = req.body;

    // Step 1: Get AI RAG answer
    let reply = await generateRAGResponse(message, history || []);

    // Step 2: Translate if needed
    if (language && language !== "en") {
      reply = await translateWithSarvam(reply, language);
    }

    res.json({ reply });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Chatbot failed" });
  }
};

exports.handleSTT = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No audio file provided" });
    }

    const transcript = await speechToText(req.file.buffer);
    res.json({ transcript });
  } catch (error) {
    console.error("STT Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Speech to text failed" });
  }
};
