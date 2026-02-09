const express = require("express");
const router = express.Router();

const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");

const {
    applyForService,
    getAllApplications,
    getMyApplications,
    getApplicationById,
    updateApplicationStatus
} = require("../controllers/serviceApplication.controller");

// Apply for service (Citizen)
router.post(
    "/apply",
    authenticate,
    authorize("Citizen"),
    applyForService
);

// Get my applications (Citizen)
router.get(
    "/my",
    authenticate,
    authorize("Citizen"),
    getMyApplications
);

// Get all applications (Employee/Admin)
router.get(
    "/",
    authenticate,
    authorize("Employee", "Admin"),
    getAllApplications
);

// Get application by ID
router.get(
    "/:id",
    authenticate,
    authorize("Citizen", "Employee", "Admin"),
    getApplicationById
);

// Update application status (Employee/Admin)
router.put(
    "/:id/status",
    authenticate,
    authorize("Employee", "Admin"),
    updateApplicationStatus
);

module.exports = router;
