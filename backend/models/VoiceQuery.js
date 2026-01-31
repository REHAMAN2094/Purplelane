const mongoose = require("mongoose");

const VoiceQuerySchema = new mongoose.Schema({
  citizen_id: mongoose.Schema.Types.ObjectId,
  query_text: String,
  detected_intent: String,
  action_performed: String
}, { timestamps: true });

module.exports = mongoose.model("VoiceQuery", VoiceQuerySchema);
