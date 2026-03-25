require("dotenv").config();
const mongoose = require("mongoose");
const Scheme = require("./models/Scheme");

async function listSchemes() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const schemes = await Scheme.find({});
    console.log("Schemes in DB:", schemes.map(s => s.name));
    await mongoose.disconnect();
  } catch (error) {
    console.error(error);
  }
}

listSchemes();
