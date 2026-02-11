require("dotenv").config();
const mongoose = require("mongoose");
const Scheme = require("./models/Scheme");

async function listSchemes() {
    try {
        await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/purplelane");
        const schemes = await Scheme.find({});
        console.log("Found Schemes:", JSON.stringify(schemes, null, 2));
        mongoose.connection.close();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

listSchemes();
