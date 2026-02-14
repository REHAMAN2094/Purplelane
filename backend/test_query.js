require("dotenv").config();
const { index } = require("./utils/pineconeClient");
const { createEmbedding } = require("./utils/embedding");

async function testQuery() {
    try {
        console.log("🔍 Testing Pinecone query...");

        const queryText = "ration card";
        console.log(`Query: "${queryText}"`);

        const embedding = await createEmbedding(queryText);
        console.log(`✅ Embedding created. Dimension: ${embedding.length}`);

        // Test services namespace
        console.log("\n📦 Querying 'services' namespace...");
        const serviceResults = await index.namespace("services").query({
            vector: embedding,
            topK: 2,
            includeMetadata: true
        });

        console.log(`Found ${serviceResults.matches?.length || 0} matches`);
        if (serviceResults.matches && serviceResults.matches.length > 0) {
            serviceResults.matches.forEach((match, i) => {
                console.log(`\n  Match ${i + 1}:`);
                console.log(`    Score: ${match.score}`);
                console.log(`    Name: ${match.metadata?.name}`);
            });
        }

        // Test schemes namespace
        console.log("\n🎯 Querying 'schemes' namespace...");
        const schemeResults = await index.namespace("schemes").query({
            vector: embedding,
            topK: 2,
            includeMetadata: true
        });

        console.log(`Found ${schemeResults.matches?.length || 0} matches`);
        if (schemeResults.matches && schemeResults.matches.length > 0) {
            schemeResults.matches.forEach((match, i) => {
                console.log(`\n  Match ${i + 1}:`);
                console.log(`    Score: ${match.score}`);
                console.log(`    Name: ${match.metadata?.name}`);
            });
        }

    } catch (error) {
        console.error("❌ Query Error:", error);
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
    }
}

testQuery();
