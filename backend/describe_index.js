require("dotenv").config();
const { pc } = require("./utils/pineconeClient");

async function describeIndex() {
    try {
        const fs = require('fs');
        const indexName = process.env.PINECONE_INDEX_NAME;
        console.log(`Describing index: ${indexName}`);
        const description = await pc.describeIndex(indexName);
        console.log(`Index Dimension: ${description.dimension}`);
        fs.writeFileSync('index_info.txt', JSON.stringify(description, null, 2));
        console.log("Index info saved to index_info.txt");
    } catch (error) {
        console.error("Error describing index:", error);
    }
}

describeIndex();
