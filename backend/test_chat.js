require("dotenv").config();
const { generateRAGResponse } = require("./services/aiService");

async function testChat() {
    try {
        console.log("Testing Gemini Chat (generateRAGResponse)...");
        const reply = await generateRAGResponse("What is a Ration Card?");
        console.log("Chatbot Reply:", reply);
    } catch (error) {
        console.error("Chat Error:", error.message);
        if (error.response) {
            console.error("Error Response Data:", JSON.stringify(error.response.data, null, 2));
        }
        if (error.details) {
            console.error("Error Details:", JSON.stringify(error.details, null, 2));
        }
    }
}

testChat();
