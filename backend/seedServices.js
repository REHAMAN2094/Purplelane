require("dotenv").config();
const connectDB = require("./config/db");
const Service = require("./models/Service");
const { index } = require("./utils/pineconeClient");
const { createEmbedding } = require("./utils/embedding");

const services = [
    {
        name: "Ration Card",
        category: "Identity",
        description:
            "Apply for a new ration card to access subsidized food grains and essential commodities from fair price shops.",
        required_documents: [
            "Aadhaar Card",
            "Address Proof (Electricity Bill/Rent Agreement)",
            "Passport Size Photos",
            "Income Certificate",
        ],
        processing_days: 15,
        is_active: true,
    },
    {
        name: "PAN Card",
        category: "Identity",
        description:
            "Permanent Account Number (PAN) card is mandatory for income tax purposes and various financial transactions.",
        required_documents: [
            "Aadhaar Card",
            "Date of Birth Proof (Birth Certificate/School Certificate)",
            "Address Proof",
            "Passport Size Photos",
        ],
        processing_days: 30,
        is_active: true,
    },
    {
        name: "Caste Certificate",
        category: "Certificate",
        description:
            "Official certificate proving your caste/community for availing reservation benefits in education and employment.",
        required_documents: [
            "Aadhaar Card",
            "School Leaving Certificate",
            "Community Certificate (if available)",
            "Parent's Caste Certificate",
            "Birth Certificate",
        ],
        processing_days: 7,
        is_active: true,
    },
    {
        name: "Income Certificate",
        category: "Certificate",
        description:
            "Certificate stating your annual family income, required for scholarships, fee concessions, and various government schemes.",
        required_documents: [
            "Aadhaar Card",
            "Salary Slips (for employed)/Land Records (for farmers)",
            "Bank Statement (last 6 months)",
            "Ration Card",
            "Property Tax Receipt (if applicable)",
        ],
        processing_days: 10,
        is_active: true,
    },
];

async function seedServices() {
    try {
        await connectDB();
        console.log("✅ MongoDB connected");

        // Insert missing services
        for (const service of services) {
            const exists = await Service.findOne({ name: service.name });
            if (!exists) {
                await Service.create(service);
                console.log(`✅ Inserted: ${service.name}`);
            }
        }

        const allServices = await Service.find({});
        console.log(`📦 Total services: ${allServices.length}`);

        if (!allServices.length) {
            console.log("⚠️ No services found.");
            process.exit(0);
        }

        console.log("🚀 Creating vectors...");

        const vectors = [];

        for (const service of allServices) {
            const ragText = `
Service Name: ${service.name}
Category: ${service.category}
Description: ${service.description}
Required Documents: ${service.required_documents?.join(", ") || ""}
Processing Days: ${service.processing_days || ""}
`;

            const embedding = await createEmbedding(ragText);

            if (!embedding || !Array.isArray(embedding) || embedding.length === 0) {
                console.log(`❌ Embedding failed: ${service.name}`);
                continue;
            }

            console.log(
                `✅ Embedding created for ${service.name} | Dimension: ${embedding.length}`
            );

            vectors.push({
                id: service._id.toString(),
                values: embedding,
                metadata: {
                    name: service.name,
                    category: service.category,
                    text: ragText,
                },
            });
        }

        console.log("📦 Total vectors ready:", vectors.length);

        if (!vectors.length) {
            throw new Error("No vectors prepared. Stopping upsert.");
        }

        // 🔥 CORRECT v7 SYNTAX
        // 🔥 CORRECT v7 SYNTAX
        await index.namespace("services").upsert({ records: vectors });

        console.log("🎉 Pinecone seeding completed successfully!");
        process.exit(0);
    } catch (error) {
        console.error("❌ Seeding failed:", error);
        process.exit(1);
    }
}

seedServices();
