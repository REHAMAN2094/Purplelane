require("dotenv").config();
const mongoose = require("mongoose");
const Scheme = require("./models/Scheme");
const Citizen = require("./models/Citizen");
const SchemeApplication = require("./models/schemeApplication");
const Complaints = require("./models/Complaint");

async function seedTestData() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const userId = "698ec6332f59e43033e1c0f6";
    const scheme = await Scheme.findOne();
    
    if (!scheme) {
      console.log("No schemes found to link applications to.");
      return;
    }

    // Seed a Scheme Application
    await SchemeApplication.create({
      scheme_id: scheme._id,
      citizen_id: userId,
      application_no: "APP12345",
      status: "In Progress",
      remarks: "Verification pending with local volunteer."
    });
    console.log("Seed: Created Scheme Application");

    // Seed a Complaint
    await Complaints.create({
      citizen_id: userId,
      title: "Street light not working",
      description: "The street light in front of house 42 has been off for a week.",
      category: "Electricity",
      priority: "Medium",
      status: "Submitted",
      complaint_no: "CMP98765"
    });
    console.log("Seed: Created Complaint");

    await mongoose.disconnect();
  } catch (error) {
    console.error("Seed Error:", error);
  }
}

seedTestData();
