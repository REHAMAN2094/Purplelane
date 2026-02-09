const mongoose = require("mongoose");

const DocumentSchema = new mongoose.Schema(
  {
    file_name: String,
    file_type: String,
    data: Buffer
  },
  { _id: false }
);

const SchemeApplicationSchema = new mongoose.Schema(
  {
    scheme_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Scheme",
      required: true
    },

    citizen_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Citizen",
      required: true
    },

    application_no: {
      type: String,
      unique: true
    },

    status: {
      type: String,
      enum: ["Submitted", "In Progress", "Resolved", "Rejected"],
      default: "Submitted"
    },

    remarks: String,

    verified_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee"
    },

    // 👇 uploaded documents
    documents: [DocumentSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model("SchemeApplication", SchemeApplicationSchema);
