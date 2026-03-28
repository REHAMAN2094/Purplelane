require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

if (!process.env.GEMINI_API_KEY) {
  throw new Error("❌ GEMINI_API_KEY missing in .env");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-embedding-001",
});

async function createEmbedding(text) {
  try {
    const result = await model.embedContent(text);

    if (!result.embedding || !result.embedding.values) {
      throw new Error("Invalid embedding response from Gemini");
    }

    return result.embedding.values;
  } catch (error) {
    console.error("❌ Error generating embedding:", error.message);
    throw error;
  }
}

module.exports = { createEmbedding };
