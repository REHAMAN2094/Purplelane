require("dotenv").config();
const mongoose = require("mongoose");
const SchemeApplication = require("./models/schemeApplication");
const Complaints = require("./models/Complaint");
const Citizen = require("./models/Citizen"); // Assuming this exists

async function checkData() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const userId = "698ec6332f59e43033e1c0f6";
    
    const [apps, complaints] = await Promise.all([
      SchemeApplication.find({ citizen_id: userId }),
      Complaints.find({ citizen_id: userId })
    ]);

    console.log(`User: ${userId}`);
    console.log(`Applications found: ${apps.length}`);
    console.log(`Complaints found: ${complaints.length}`);

    if (apps.length > 0) console.log("First App:", JSON.stringify(apps[0], null, 2));
    if (complaints.length > 0) console.log("First Complaint:", JSON.stringify(complaints[0], null, 2));

    await mongoose.disconnect();
  } catch (error) {
    console.error(error);
  }
}

checkData();
