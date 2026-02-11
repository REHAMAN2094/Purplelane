const express = require("express");
const router = express.Router();

const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");
const upload = require("../middleware/uploadImage");

const {
    applyForService,
    getAllApplications,
    getMyApplications,
    getApplicationById,
    updateApplicationStatus,
    getServiceApplicationDocument
} = require("../controllers/serviceApplication.controller");


// Apply for service (Citizen)


router.post(
    "/apply",
    authenticate,
    authorize("Citizen"),
    upload.array("documents", 10),
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

// Get application document
router.get(
    "/:id/document/:index",
    authenticate,
    authorize("Employee", "Admin", "Citizen"),
    getServiceApplicationDocument
);

module.exports = router;
