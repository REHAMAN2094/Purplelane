const mongoose = require("mongoose");

const SchemeSchema = new mongoose.Schema({
  name: String,
  state: String,
  category: String,
  description: String,
  eligibility_criteria: [String],
  benefits: String,
  is_active: Boolean
}, { timestamps: true });

module.exports = mongoose.model("Scheme", SchemeSchema);
