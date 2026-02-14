require("dotenv").config();
const { generateRAGResponse } = require("./services/aiService");

async function testChatbot() {
    try {
        console.log("🤖 Testing Chatbot RAG...");

        // Test 1: Service Query
        const query1 = "How do I apply for a Ration Card?";
        console.log(`\n❓ Question: ${query1}`);
        const answer1 = await generateRAGResponse(query1);
        console.log(`💡 Answer: ${answer1}\n`);

        // Test 2: Scheme Query
        const query2 = "Tell me about the Amma Vodi scheme.";
        console.log(`❓ Question: ${query2}`);
        const answer2 = await generateRAGResponse(query2);
        console.log(`💡 Answer: ${answer2}\n`);

        // Test 3: Irrelevant Query
        const query3 = "What is the capital of France?";
        console.log(`❓ Question: ${query3}`);
        const answer3 = await generateRAGResponse(query3);
        console.log(`💡 Answer: ${answer3}\n`);

    } catch (error) {
        console.error("❌ Chatbot Test Failed:", error);
    }
}

testChatbot();
