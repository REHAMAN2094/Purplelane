const mongoose = require("mongoose");

const ActivityLogSchema = new mongoose.Schema({
  user_id: mongoose.Schema.Types.ObjectId,
  user_type: String,
  action: String,
  module: String,
  reference_id: mongoose.Schema.Types.ObjectId,
  ip_address: String
}, { timestamps: true });

module.exports = mongoose.model("ActivityLog", ActivityLogSchema);
