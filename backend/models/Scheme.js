const mongoose = require("mongoose");

const SchemeSchema = new mongoose.Schema({
  // Basic Info (Card + Header)
  name: {
    type: String,
    required: true
  },

  state: {
    type: String,
    default: "Andhra Pradesh"
  },

  categories: [
    {
      type: String   // e.g. "Social Welfare", "Education Support"
    }
  ],

  is_active: {
    type: Boolean,
    default: true
  },

  short_description: {
    type: String
  },

  // Detail View Content
  description: {
    type: String
  },

  benefits: {
    type: String   // rich text / paragraph
  },

  eligibility_criteria: [
    {
      type: String
    }
  ],

  target_group: {
    type: String
  },

  required_documents: [
    {
      type: String   // Aadhaar, School ID, Bank Details
    }
  ],

  application_steps: [
    {
      step_no: Number,
      step_text: String
    }
  ],

  // Admin / System Fields
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Login"
  }

}, { timestamps: true });

module.exports = mongoose.model("Scheme", SchemeSchema);

/*{
  "name": "Thalliki Vandanam Scheme",
  "state": "Andhra Pradesh",
  "categories": ["Social Welfare", "Education Support"],
  "is_active": true,
  "short_description": "Financial support scheme for school-going children in Andhra Pradesh through direct benefit transfer to mother's bank account.",

  "description": "Financial support scheme for school-going children in Andhra Pradesh through direct benefit transfer to mother's bank account.",

  "benefits": "₹15,000 per eligible student via direct benefit transfer (DBT), into mother's bank account; includes school development funds.",

  "eligibility_criteria": [
    "All school-going children resident in Andhra Pradesh"
  ],

  "target_group": "School-going children and their mothers",

  "required_documents": [
    "Aadhaar",
    "Child's school ID",
    "Bank details"
  ],

  "application_steps": [
    { "step_no": 1, "step_text": "Citizen login → Select scheme" },
    { "step_no": 2, "step_text": "Submit student details" },
    { "step_no": 3, "step_text": "Upload documents" },
    { "step_no": 4, "step_text": "Track status" }
  ]
}
*/