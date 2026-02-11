const express = require("express");
const router = express.Router();
const Employee = require("../models/Employee");
const { updateServiceStatus } = require("../controllers/employee.controller");
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");

router.post("/", async (req, res) => {
  res.json(await Employee.create(req.body));
});

router.get("/", async (req, res) => {
  res.json(await Employee.find());
});

router.get("/:id", async (req, res) => {
  res.json(await Employee.findById(req.params.id));
});

router.put("/:id", async (req, res) => {
  res.json(
    await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true })
  );
});

router.put("/applicationn/verify", updateServiceStatus)

module.exports = router;
