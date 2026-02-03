const express = require("express");
const router = express.Router();

const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");

const {
  createFeedback,
  getAllFeedback,
  getFeedbackByComplaint
} = require("../controllers/feedback.controller");

// citizen submits feedback
router.post(
  "/",
  authenticate,
  authorize("Citizen"),
  createFeedback
);

// admin / employee view all feedback
router.get(
  "/",
  authenticate,
  authorize("Admin", "Employee"),
  getAllFeedback
);

// get feedback for a complaint
router.get(
  "/complaint/:complaintId",
  authenticate,
  authorize("Admin", "Employee", "Citizen"),
  getFeedbackByComplaint
);

module.exports = router;
