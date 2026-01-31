const express = require("express");
const router = express.Router();
const Application = require("../models/Application");

router.post("/", async (req, res) => {
  const app = await Application.create(req.body);
  res.json(app);
});

router.get("/:id", async (req, res) => {
  const app = await Application.findById(req.params.id);
  res.json(app);
});

router.put("/:id/status", async (req, res) => {
  const app = await Application.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  );
  res.json(app);
});

module.exports = router;
