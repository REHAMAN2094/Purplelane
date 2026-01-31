const express = require("express");
const router = express.Router();

const {
  createCitizen,
  getAllCitizens,
  getCitizenById,
  updateCitizen,
  deleteCitizen
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

module.exports = router;
