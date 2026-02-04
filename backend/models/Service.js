const mongoose = require("mongoose");

const ServiceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    }, 
    // e.g. Birth Certificate, Death Certificate, EC, Ration Card

    category: {
      type: String,
      enum: [
        "Certificate",
        "Identity",
        "Land",
        "Welfare",
        "Other"
      ],
      default: "Other"
    },

    description: String,

    required_documents: [
      {
        type: String
      }
    ],

    processing_days: Number,

    is_active: {
      type: Boolean,
      default: true
    },

    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Login" // Admin
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Service", ServiceSchema);
