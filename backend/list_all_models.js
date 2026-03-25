require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function listAllModels() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // Use the official listModels method if it exists
    const models = await genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // dummy to get to the client
    // Actually, let's just try to fetch the list directly if possible
    // But the SDK doesn't expose listModels easily.
    // Let's try the URL directly via axios
    const axios = require("axios");
    const response = await axios.get(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
    console.log("Available Models:");
    response.data.models.forEach(m => {
      console.log(`- ${m.name} (Supports: ${m.supportedGenerationMethods.join(", ")})`);
    });
  } catch (err) {
    console.error("Error fetching models:", err.response?.data || err.message);
  }
}

listAllModels();
