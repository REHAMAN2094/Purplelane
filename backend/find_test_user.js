require("dotenv").config();
const mongoose = require("mongoose");
const SchemeApplication = require("./models/schemeApplication");
const Complaints = require("./models/Complaint");

async function findData() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    const [app, complaint] = await Promise.all([
      SchemeApplication.findOne().limit(1),
      Complaints.findOne().limit(1)
    ]);

    if (app) console.log(`Found application for user: ${app.citizen_id}`);
    if (complaint) console.log(`Found complaint for user: ${complaint.citizen_id}`);

    await mongoose.disconnect();
  } catch (error) {
    console.error(error);
  }
}

findData();
