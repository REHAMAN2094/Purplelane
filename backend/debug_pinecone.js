require("dotenv").config();
const { index } = require("./utils/pineconeClient");

async function testPinecone() {
    try {
        console.log("Testing Pinecone upsert with dummy data...");

        // Create a dummy vector of 768 zeros (assuming 768-dim index)
        const dummyVector = new Array(768).fill(0.1);

        const record = {
            id: "test-id-1",
            values: dummyVector,
            metadata: {
                text: "Test metadata",
            }
        };

        console.log("Upserting record:", JSON.stringify(record).substring(0, 100) + "...");

        await index.upsert([record]);

        console.log("✅ Successfully upserted dummy record.");

        // Cleanup
        // await index.deleteOne("test-id-1"); // Optional

    } catch (error) {
        console.error("❌ Pinecone Error:", error);
    }
}

testPinecone();
