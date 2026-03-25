require("dotenv").config();
const mongoose = require("mongoose");
const { generateRAGResponse } = require("./services/aiService");

async function testContext() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Use the ID from the user's log
    const testUserId = "698ec6332f59e43033e1c0f6"; 
    
    console.log(`Testing chatbot context for User: ${testUserId}`);

    const questions = [
      "What is the status of my scheme applications?",
      "Do I have any active complaints?",
      "Tell me about the Thalliki Vandanam Scheme"
    ];

    for (const q of questions) {
      console.log(`\nUser: ${q}`);
      const response = await generateRAGResponse(q, [], testUserId);
      console.log(`AI: ${response}`);
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error("Test Error:", error);
    process.exit(1);
  }
}

testContext();
