const express = require("express");
const router = express.Router();
const Complaint = require("../models/Complaint");

router.post("/", async (req, res) => {
  const complaint = await Complaint.create(req.body);
  res.json(complaint);
});

router.get("/:id", async (req, res) => {
  res.json(await Complaint.findById(req.params.id));
});

router.put("/:id/status", async (req, res) => {
  res.json(
    await Complaint.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    )
  );
});

module.exports = router;
