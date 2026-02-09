require("dotenv").config();
const connectDB = require("./config/db");
const Service = require("./models/Service");

const services = [
    {
        name: "Ration Card",
        category: "Identity",
        description: "Apply for a new ration card to access subsidized food grains and essential commodities from fair price shops.",
        required_documents: [
            "Aadhaar Card",
            "Address Proof (Electricity Bill/Rent Agreement)",
            "Passport Size Photos",
            "Income Certificate"
        ],
        processing_days: 15,
        is_active: true
    },
    {
        name: "PAN Card",
        category: "Identity",
        description: "Permanent Account Number (PAN) card is mandatory for income tax purposes and various financial transactions.",
        required_documents: [
            "Aadhaar Card",
            "Date of Birth Proof (Birth Certificate/School Certificate)",
            "Address Proof",
            "Passport Size Photos"
        ],
        processing_days: 30,
        is_active: true
    },
    {
        name: "Caste Certificate",
        category: "Certificate",
        description: "Official certificate proving your caste/community for availing reservation benefits in education and employment.",
        required_documents: [
            "Aadhaar Card",
            "School Leaving Certificate",
            "Community Certificate (if available)",
            "Parent's Caste Certificate",
            "Birth Certificate"
        ],
        processing_days: 7,
        is_active: true
    },
    {
        name: "Income Certificate",
        category: "Certificate",
        description: "Certificate stating your annual family income, required for scholarships, fee concessions, and various government schemes.",
        required_documents: [
            "Aadhaar Card",
            "Salary Slips (for employed)/Land Records (for farmers)",
            "Bank Statement (last 6 months)",
            "Ration Card",
            "Property Tax Receipt (if applicable)"
        ],
        processing_days: 10,
        is_active: true
    }
];

async function seedServices() {
    try {
        await connectDB();

        const existingCount = await Service.countDocuments();

        if (existingCount > 0) {
            console.log(`Found ${existingCount} existing services. Skipping seed...`);
            process.exit(0);
        }

        const result = await Service.insertMany(services);
        console.log(`✅ Successfully seeded ${result.length} services:`);
        result.forEach(service => {
            console.log(`   - ${service.name} (${service.category})`);
        });

        process.exit(0);
    } catch (error) {
        console.error("Error seeding services:", error.message);
        process.exit(1);
    }
}

seedServices();
