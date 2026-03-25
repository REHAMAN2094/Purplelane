require("dotenv").config();
const mongoose = require("mongoose");
const Scheme = require("./models/Scheme");
const { index } = require("./utils/pineconeClient");
const { createEmbedding } = require("./utils/embedding");

async function seedSchemes() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ MongoDB connected");

        const allSchemes = await Scheme.find({});
        console.log(`📦 Total schemes in DB: ${allSchemes.length}`);

        if (!allSchemes.length) {
            console.log("⚠️ No schemes found in database to seed.");
            process.exit(0);
        }

        console.log("🚀 Creating vectors for schemes...");

        const vectors = [];

        for (const scheme of allSchemes) {
            const ragText = `
Scheme Name: ${scheme.name}
State: ${scheme.state}
Category: ${scheme.categories?.join(", ") || ""}
Description: ${scheme.description || scheme.short_description || ""}
Benefits: ${scheme.benefits || ""}
Eligibility: ${scheme.eligibility_criteria?.join(", ") || ""}
Target Group: ${scheme.target_group || ""}
Documents Required: ${scheme.required_documents?.join(", ") || ""}
`;

            const embedding = await createEmbedding(ragText);

            if (!embedding || !Array.isArray(embedding) || embedding.length === 0) {
                console.log(`❌ Embedding failed: ${scheme.name}`);
                continue;
            }

            console.log(`✅ Embedding created for ${scheme.name}`);

            vectors.push({
                id: scheme._id.toString(),
                values: embedding,
                metadata: {
                    name: scheme.name,
                    type: "Scheme",
                    text: ragText,
                },
            });
        }

        console.log("📦 Total vectors ready:", vectors.length);

        if (vectors.length > 0) {
            await index.namespace("schemes").upsert({ records: vectors });
            console.log("🎉 Pinecone schemes seeding completed successfully!");
        } else {
            console.log("⚠️ No vectors prepared.");
        }

        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error("❌ Seeding failed:", error);
        process.exit(1);
    }
}

seedSchemes();
