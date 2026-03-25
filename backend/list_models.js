require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function listModels() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // There isn't a direct listModels in the SDK for easy use without the manager, 
    // but we can try a few known variants.
    console.log("Testing known model names...");
    const models = ["gemini-1.5-flash", "gemini-1.5-flash-latest", "gemini-1.5-pro", "gemini-1.5-pro-latest"];
    
    for (const modelName of models) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent("test");
        console.log(`✅ ${modelName} is working.`);
      } catch (e) {
        console.log(`❌ ${modelName} failed: ${e.message}`);
      }
    }
  } catch (err) {
    console.error(err);
  }
}

listModels();
