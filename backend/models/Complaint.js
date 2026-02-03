const mongoose = require("mongoose");

const AttachmentSchema = new mongoose.Schema(
  {
    file_name: String,
    file_type: {
      type: String,
      enum: ["image/jpeg", "image/png", "image/jpg"]
    },
    data: Buffer // image stored as byte code
  },
  { _id: false }
);

const ComplaintSchema = new mongoose.Schema(
  {
    citizen_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Citizen",
      required: true
    },

    department_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department"
    },

    title: {
      type: String,
      required: true
    },

    description: {
      type: String,
      required: true
    },

    location: String,
    village: String,

    category: {
      type: String,
      enum: [
        "Water Supply",
        "Electricity",
        "Road Maintenance",
        "Sanitation",
        "Health",
        "Education",
        "Infrastructure",
        "Other"
      ],
      default: "Other"
    },

    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Urgent"],
      default: "Medium"
    },

    complaint_no: {
      type: String,
      unique: true
    },

    status: {
      type: String,
      enum: ["Submitted", "Assigned", "In Progress", "Resolved", "Closed"],
      default: "Submitted"
    },

    assigned_to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee"
    },

    attachments: [AttachmentSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Complaint", ComplaintSchema);
