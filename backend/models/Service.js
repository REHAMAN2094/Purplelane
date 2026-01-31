const mongoose = require("mongoose");

const ServiceSchema = new mongoose.Schema({
  department_id: { type: mongoose.Schema.Types.ObjectId, ref: "Department" },
  name: String,
  category: String,
  description: String,
  required_documents: [String],
  estimated_processing_days: Number
}, { timestamps: true });

module.exports = mongoose.model("Service", ServiceSchema);
