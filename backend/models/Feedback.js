const mongoose = require("mongoose");

const FeedbackSchema = new mongoose.Schema(
  {
    citizen_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Citizen",
      required: true
    },

    citizen_name: {
      type: String,
      required: true
    },

    // optional but recommended (feedback after complaint resolution)
    complaint_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Complaint"
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },

    description: {
      type: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Feedback", FeedbackSchema);
