const { GoogleGenerativeAI } = require("@google/generative-ai");
const axios = require("axios");
const { index } = require("../utils/pineconeClient");
const { createEmbedding } = require("../utils/embedding");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || process.env.gemini_api_key);

// 🔹 Query Pinecone
// 🔹 Query Pinecone (Schemes + Services)
async function searchPinecone(query) {
  try {
    const embedding = await createEmbedding(query);

    // Query both namespaces in parallel
    console.log("Searching Pinecone namespaces...");
    const [schemeResults, serviceResults] = await Promise.all([
      index.namespace("schemes").query({
        vector: embedding,
        topK: 3,
        includeMetadata: true
      }),
      index.namespace("services").query({
        vector: embedding,
        topK: 3,
        includeMetadata: true
      })
    ]);

    console.log(`Found ${schemeResults.matches?.length || 0} schemes, ${serviceResults.matches?.length || 0} services.`);

    // Combine and format matches
    const allMatches = [
      ...(schemeResults.matches || []),
      ...(serviceResults.matches || [])
    ];

    // Sort by score if needed, but for now just returning all top matches
    return allMatches;
  } catch (error) {
    console.error("Pinecone Search Error:", error);
    return [];
  }
}

// 🔹 Generate final answer using RAG
async function generateRAGResponse(userQuestion, history = []) {
  const matches = await searchPinecone(userQuestion);

  if (!matches || matches.length === 0) {
    return "I'm sorry, I couldn't find any relevant information in our database regarding your query. Please contact the department directly.";
  }

  console.log(`Processing ${matches.length} matches...`);
  console.log("First match structure:", JSON.stringify(matches[0], null, 2));

  const context = matches
    .map(m => `[${m.metadata?.type || 'Info'}]: ${m.metadata?.text}`)
    .join("\n\n");

  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash"
  });

  // Start chat with history
  const chat = model.startChat({
    history: history.map(h => ({
      role: h.role === "user" ? "user" : "model",
      parts: [{ text: h.content }]
    })),
  });

  const prompt = `
You are the "Purplelane" AI Assistant for the Andhra Pradesh Government.
Your goal is to help citizens with Government Schemes and Services.

Strictly answer based on the provided context below.
If the answer is not in the context, say "I don't have information on that topic."

Context:
${context}

User Question:
${userQuestion}

Answer (in helpful, friendly tone):
`;

  try {
    const result = await chat.sendMessage(prompt);

    // Check if response is blocked or empty
    if (!result || !result.response) {
      console.error("Gemini Error: No response received");
      return "I apologize, but I'm unable to generate a response at the moment.";
    }

    return result.response.text();
  } catch (err) {
    console.error("Gemini Generation Error:", err);
    return "I encountered an error while processing your request.";
  }
}

// 🔹 Translate using Sarvam
async function translateWithSarvam(text, targetLang) {
  const response = await axios.post(
    "https://api.sarvam.ai/translate",
    {
      input: text,
      source_language: "auto",
      target_language: targetLang
    },
    {
      headers: {
        "api-subscription-key": process.env.SARVAM_API_KEY,
        "Content-Type": "application/json"
      }
    }
  );

  return response.data.translated_text;
}

// 🔹 Speech to Text using Sarvam
async function speechToText(audioBuffer) {
  const FormData = require("form-data");
  const form = new FormData();
  form.append("file", audioBuffer, { filename: "recording.wav", contentType: "audio/wav" });
  form.append("model", "saarathi-v1");
  // If we want translation to English from Telugu/Hindi etc.
  // form.append("translate_to", "en"); 

  const response = await axios.post(
    "https://api.sarvam.ai/speech-to-text-translate",
    form,
    {
      headers: {
        ...form.getHeaders(),
        "api-subscription-key": process.env.SARVAM_API_KEY
      }
    }
  );

  return response.data.transcript;
}

module.exports = {
  generateRAGResponse,
  translateWithSarvam,
  speechToText
};
