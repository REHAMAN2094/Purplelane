require("dotenv").config();
const mongoose = require("mongoose");

async function checkCollections() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log("Collections:", collections.map(c => c.name));
    
    for (const coll of collections) {
      const count = await mongoose.connection.db.collection(coll.name).countDocuments();
      console.log(`- ${coll.name}: ${count} documents`);
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error(error);
  }
}

checkCollections();
