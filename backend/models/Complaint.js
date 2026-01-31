const mongoose = require("mongoose");

const ComplaintSchema = new mongoose.Schema({
  citizen_id: mongoose.Schema.Types.ObjectId,
  department_id: mongoose.Schema.Types.ObjectId,
  subject: String,
  description: String,
  complaint_no: String,
  priority: String,
  status: {
    type: String,
    enum: ["Submitted","Assigned","In Progress","Resolved","Closed"],
    default: "Submitted"
  },
  assigned_to: mongoose.Schema.Types.ObjectId
}, { timestamps: true });

module.exports = mongoose.model("Complaint", ComplaintSchema);
