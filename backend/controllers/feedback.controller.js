const Feedback = require("../models/Feedback");

/**
 * CREATE FEEDBACK (Citizen only)
 */
exports.createFeedback = async (req, res) => {
  try {
    const { rating, description, complaint_id, citizen_name } = req.body;

    // rating validation
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        message: "Rating must be between 1 and 5"
      });
    }

    const feedback = await Feedback.create({
      citizen_id: req.user.id,   // from JWT
      citizen_name,
      complaint_id,
      rating,
      description
    });

    res.status(201).json({
      message: "Feedback submitted successfully",
      feedback
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * GET ALL FEEDBACK (Admin / Employee)
 */
exports.getAllFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
      .populate("citizen_id", "name")
      .populate("complaint_id", "complaint_no")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: feedbacks.length,
      feedbacks
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * GET FEEDBACK BY COMPLAINT
 */
exports.getFeedbackByComplaint = async (req, res) => {
  try {
    const feedback = await Feedback.findOne({
      complaint_id: req.params.complaintId
    });

    if (!feedback) {
      return res.status(404).json({
        message: "No feedback found for this complaint"
      });
    }

    res.json(feedback);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
