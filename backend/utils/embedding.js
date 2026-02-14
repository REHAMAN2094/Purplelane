require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

if (!process.env.gemini_api_key) {
  throw new Error("❌ gemini_api_key missing in .env");
}

const genAI = new GoogleGenerativeAI(process.env.gemini_api_key);
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
