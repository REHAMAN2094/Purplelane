const express = require("express");
const router = express.Router();
const Document = require("../models/Document");

router.post("/upload", async (req, res) => {
  res.json(await Document.create(req.body));
});

router.get("/:id", async (req, res) => {
  res.json(await Document.findById(req.params.id));
});

router.put("/:id/verify", async (req, res) => {
  res.json(
    await Document.findByIdAndUpdate(
      req.params.id,
      { verified: true, verified_by: req.body.employee_id },
      { new: true }
    )
  );
});

module.exports = router;
