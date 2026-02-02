const express = require("express");
const router = express.Router();

const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");

const {
  createScheme,
  updateScheme,
  getAllSchemes,
  getSchemeById
} = require("../controllers/scheme.controller");

// ADMIN ONLY
router.post(
  "/",
  authenticate,
  authorize("Admin"),
  createScheme
);

router.put(
  "/:id",
  authenticate,
  authorize("Admin"),
  updateScheme
);

// VIEW (Citizen + Employee + Admin)
router.get(
  "/",
  authenticate,
  authorize("Citizen", "Employee", "Admin"),
  getAllSchemes
);

router.get(
  "/:id",
  authenticate,
  authorize("Citizen", "Employee", "Admin"),
  getSchemeById
);

module.exports = router;
