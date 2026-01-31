const mongoose = require("mongoose");

const DocumentSchema = new mongoose.Schema({
  owner_id: mongoose.Schema.Types.ObjectId,
  owner_type: {
    type: String,
    enum: ["Citizen", "Application", "SchemeApplication"]
  },
  document_type: String,
  file_name: String,
  file_path: String,
  verified: {
    type: Boolean,
    default: false
  },
  verified_by: mongoose.Schema.Types.ObjectId
}, { timestamps: true });

module.exports = mongoose.model("Document", DocumentSchema);
