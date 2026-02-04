const express = require("express");
const router = express.Router();

const {
  createCitizen,
  getAllCitizens,
  getCitizenById,
  updateCitizen,
  deleteCitizen,
  applyService
} = require("../controllers/citizen.controller");

// register citizen
router.post("/register", createCitizen);

// get all citizens
router.get("/", getAllCitizens);

// get citizen by id
router.get("/:id", getCitizenById);

// update citizen
router.put("/:id", updateCitizen);

// delete citizen
router.delete("/:id", deleteCitizen);

router.post("/apply-service", applyService );

module.exports = router;
