const express = require("express");
const router = express.Router();

const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");
const upload = require("../middleware/uploadImage");

const {
  createComplaint,
  getComplaintById,
  getComplaintImage,
  getAllComplaints
} = require("../controllers/complaint.controller");

// create complaint (Citizen)
router.post(
  "/",
  authenticate,
  authorize("Citizen"),
  upload.array("attachments", 3),
  createComplaint
);

// get complaint details
router.get(
  "/:id",
  authenticate,
  authorize("Citizen", "Employee", "Admin"),
  getComplaintById
);

// get complaint image
router.get(
  "/:id/image",
  authenticate,
  authorize("Citizen", "Employee", "Admin"),
  getComplaintImage
);

router.get(
  "/:id/image/:index",
  authenticate,
  authorize("Citizen", "Employee", "Admin"),
  getComplaintImage
);
 
router.get(
  "/",
  authenticate,
  authorize("Citizen", "Employee", "Admin"),
  getAllComplaints
);


module.exports = router;
