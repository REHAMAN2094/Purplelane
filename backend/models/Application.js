const mongoose = require("mongoose");

const ApplicationSchema = new mongoose.Schema({
  service_id: { type: mongoose.Schema.Types.ObjectId, ref: "Service" },
  citizen_id: { type: mongoose.Schema.Types.ObjectId, ref: "Citizen" },
  application_no: String,
  status: {
    type: String,
    enum: ["Submitted","Verified","In Process","Approved","Rejected","Closed"],
    default: "Submitted"
  },
  assigned_to: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
  remarks: String
}, { timestamps: true });

module.exports = mongoose.model("Application", ApplicationSchema);
