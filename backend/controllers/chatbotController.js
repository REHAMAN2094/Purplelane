const { generateRAGResponse, translateWithGemini, speechToText } =
  require("../services/aiService");

exports.chatbotReply = async (req, res) => {
  try {
    const { message, language, history } = req.body;
    const userId = req.user?.id;

    // Detect if input is Telugu (Non-ASCII Telugu script check)
    // Telugu Unicode range: \u0C00-\u0C7F
    const isTelugu = /[\u0C00-\u0C7F]/.test(message);
    let processingMessage = message;

    if (isTelugu) {
      console.log("[Chatbot] Telugu detected, translating to English for RAG...");
      processingMessage = await translateWithGemini(message, "English");
      console.log("[Chatbot] Translated Query:", processingMessage);
    }

    // Step 1: Get AI RAG answer
    // We always use the English version for RAG search
    let reply = await generateRAGResponse(processingMessage, history || [], userId);

    // Step 2: Translate back if the original input was Telugu
    if (isTelugu) {
      console.log("[Chatbot] Translating response back to Telugu...");
      reply = await translateWithGemini(reply, "Telugu");
    } else if (language && language !== "en") {
      // Fallback for explicitly requested languages
      reply = await translateWithGemini(reply, language);
    }

    res.json({ reply });

  } catch (error) {
    console.error("Chatbot Controller Error:", error);

    // Check for 429 or quota errors
    if (error.status === 429 || error.message?.includes("quota") || error.details?.[0]?.reason === "QUOTA_EXCEEDED") {
      return res.status(429).json({
        error: "Quota exceeded",
        message: "The AI assistant has reached its daily limit. Please try again later."
      });
    }

    res.status(500).json({ error: "Chatbot failed", details: error.message });
  }
};

exports.handleSTT = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No audio file provided" });
    }

    const transcript = await speechToText(req.file.buffer, req.file.mimetype);
    res.json({ transcript });
  } catch (error) {
    const fs = require("fs");
    const errorLog = {
      time: new Date().toISOString(),
      message: error.message,
      data: error.response?.data,
      status: error.response?.status
    };
    fs.appendFileSync("stt_debug.log", JSON.stringify(errorLog, null, 2) + "\n---\n");
    console.error("STT Error:", error.response?.data || error.message);

    if (error.message?.includes("SARVAM_API_KEY is missing")) {
      return res.status(500).json({ error: "STT configuration error", message: "Voice service is not configured (missing API key)." });
    }

    res.status(500).json({ error: "Speech to text failed" });
  }
};
