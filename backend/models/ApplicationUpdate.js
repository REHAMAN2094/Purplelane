const mongoose = require("mongoose");

const ApplicationUpdateSchema = new mongoose.Schema({
  application_id: { type: mongoose.Schema.Types.ObjectId, ref: "Application" },
  status: String,
  details: String,
  updated_by: mongoose.Schema.Types.ObjectId
}, { timestamps: true });

module.exports = mongoose.model("ApplicationUpdate", ApplicationUpdateSchema);
