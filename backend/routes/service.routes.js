const express = require("express");
const router = express.Router();

const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");

const {
    createService,
    getAllServices,
    getServiceById,
    updateService,
    deleteService
} = require("../controllers/service.controller");

// Get all services (public/authenticated)
router.get("/", getAllServices);

// Get service by ID
router.get("/:id", getServiceById);

// Create service (Admin only)
router.post(
    "/",
    authenticate,
    authorize("Admin"),
    createService
);

// Update service (Admin only)
router.put(
    "/:id",
    authenticate,
    authorize("Admin"),
    updateService
);

// Delete service (Admin only)
router.delete(
    "/:id",
    authenticate,
    authorize("Admin"),
    deleteService
);

module.exports = router;
