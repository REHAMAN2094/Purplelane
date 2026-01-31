const express = require("express");
const router = express.Router();
const SchemeApplication = require("../models/Scheme");

router.post("/", async (req, res) => {
  res.json(await SchemeApplication.create(req.body));
});

router.get("/:id", async (req, res) => {
  res.json(await SchemeApplication.findById(req.params.id));
});

router.get("/citizen/:citizenId", async (req, res) => {
  res.json(
    await SchemeApplication.find({ citizen_id: req.params.citizenId })
  );
});

router.put("/:id/status", async (req, res) => {
  res.json(
    await SchemeApplication.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    )
  );
});

module.exports = router;
