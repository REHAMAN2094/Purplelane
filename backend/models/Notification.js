const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
  user_id: mongoose.Schema.Types.ObjectId,
  user_type: {
    type: String,
    enum: ["Citizen", "Employee"]
  },
  message: String,
  type: {
    type: String,
    enum: ["Application", "Scheme", "Complaint", "System"]
  },
  is_read: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model("Notification", NotificationSchema);
