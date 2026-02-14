require("dotenv").config();
const { createEmbedding } = require("./utils/embedding");

async function test() {
    try {
        console.log("Testing embedding generation...");
        const text = "Test description for a service.";
        const embedding = await createEmbedding(text);

        console.log("Embedding type:", typeof embedding);
        console.log("Is Array:", Array.isArray(embedding));
        if (Array.isArray(embedding)) {
            console.log("Embedding length:", embedding.length);
            console.log("First few values:", embedding.slice(0, 5));
        } else {
            console.log("Embedding value:", embedding);
        }
    } catch (error) {
        console.error("Debug Error:", error);
    }
}

test();
