require("dotenv").config();
const { index } = require("./utils/pineconeClient");

async function checkNamespaces() {
    try {
        console.log("Checking Pinecone index stats...");

        const stats = await index.describeIndexStats();
        console.log("Index Stats:", JSON.stringify(stats, null, 2));

        console.log("\n📊 Summary:");
        console.log(`Total vectors: ${stats.totalRecordCount || 0}`);

        if (stats.namespaces) {
            console.log("\n🗂️ Namespaces:");
            for (const [name, data] of Object.entries(stats.namespaces)) {
                console.log(`  - ${name}: ${data.recordCount || 0} records`);
            }
        } else {
            console.log("⚠️ No namespace data found.");
        }

    } catch (error) {
        console.error("❌ Error checking namespaces:", error);
    }
}

checkNamespaces();
