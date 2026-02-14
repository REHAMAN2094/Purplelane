const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticate");

const {
  createCitizen,
  getAllCitizens,
  getCitizenById,
  updateCitizen,
  deleteCitizen,
  applyService
} = require("../controllers/citizen.controller");


// Registration (public)
router.post("/register", createCitizen);

// Protected routes
router.get("/:id", getCitizenById);
router.put("/:id", updateCitizen);
router.post("/apply-service", applyService);

module.exports = router;
