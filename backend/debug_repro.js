require("dotenv").config();
const { index } = require("./utils/pineconeClient");

async function testUpsert() {
    try {
        console.log("Testing Pinecone upsert with dummy data...");
        const namespace = index.namespace("services");

        // Create a dummy vector of 3072 dims (matching logs)
        const dummyVector = new Array(3072).fill(0.1);

        const record = {
            id: "test-debug-1",
            values: dummyVector,
            metadata: {
                name: "Test Service",
                category: "Test",
                text: "This is a test service for debugging.",
            },
        };

        console.log("Upserting test record...");
        // Try standard v3+ array format
        await namespace.upsert([record]);

        console.log("✅ Successfully upserted test record.");
    } catch (error) {
        console.error("❌ Upsert failed:", error.message);
        console.error("Error details:", error);
    }
}

testUpsert();
