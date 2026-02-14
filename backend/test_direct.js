require("dotenv").config();
const { index } = require("./utils/pineconeClient");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function createEmbedding(text) {
    const model = genAI.getGenerativeModel({
        model: "text-embedding-004"
    });

    const result = await model.embedContent(text);
    return result.embedding.values;
}

async function testDirect() {
    try {
        const query = "ration card";
        console.log("Creating embedding...");
        const embedding = await createEmbedding(query);
        console.log(`Embedding dimension: ${embedding.length}`);

        console.log("\nQuerying schemes namespace directly...");
        const result1 = await index.namespace("schemes").query({
            vector: embedding,
            topK: 2,
            includeMetadata: true
        });
        console.log(`Schemes matches: ${result1.matches?.length || 0}`);

        console.log("\nQuerying services namespace directly...");
        const result2 = await index.namespace("services").query({
            vector: embedding,
            topK: 2,
            includeMetadata: true
        });
        console.log(`Services matches: ${result2.matches?.length || 0}`);

    } catch (error) {
        console.error("Error:", error);
    }
}

testDirect();
