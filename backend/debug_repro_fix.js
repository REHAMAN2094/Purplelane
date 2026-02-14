require("dotenv").config();
const { index } = require("./utils/pineconeClient");

async function testUpsertFix() {
    try {
        console.log("Testing Pinecone upsert with corrected syntax...");
        const namespace = index.namespace("services");

        // Create a dummy vector of 3072 dims
        const dummyVector = new Array(3072).fill(0.1);

        const record = {
            id: "test-debug-fix-1",
            values: dummyVector,
            metadata: {
                name: "Test Service Fix",
                category: "Test",
                text: "This is a test service for debugging fix.",
            },
        };

        console.log("Upserting test record with { records: [...] } wrapper...");

        // Correct format for Pinecone v7 (according to local README)
        await namespace.upsert({
            records: [record]
        });

        console.log("✅ Successfully upserted test record with fix.");
    } catch (error) {
        console.error("❌ Upsert failed:", error.message);
        console.error("Error details:", error);
    }
}

testUpsertFix();
