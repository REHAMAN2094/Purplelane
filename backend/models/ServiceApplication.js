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

    application_no: {
      type: String,
      unique: true
    },

    form_data: {
      type: Object
      // dynamic fields (JSON)
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
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("ServiceApplication", ServiceApplicationSchema);
