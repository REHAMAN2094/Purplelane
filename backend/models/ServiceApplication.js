const mongoose = require("mongoose");

const ServiceApplicationSchema = new mongoose.Schema(
  {
    service_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true
    },

    citizen_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Citizen",
      required: true
    },
    citizen_name: {
      type: String,
      required: true
    },

    application_no: {
      type: String,
      unique: true
    },

    form_data: {
      type: Object
    },

    // NEW FIELD: uploaded documents
    documents: [
      {
        file_name: {
          type: String,
          required: true
        },
        file_type: {
          type: String,
          required: true
        },
        data: {
          type: Buffer,
          required: true
        },
        uploaded_at: {
          type: Date,
          default: Date.now
        }
      }
    ],

    status: {
      type: String,
      enum: ["Submitted", "In Progress", "Resolved", "Rejected"],
      default: "Submitted"
    },

    remarks: String,

    verified_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("ServiceApplication", ServiceApplicationSchema);
