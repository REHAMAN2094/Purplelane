const express = require("express");
const router = express.Router();
const ActivityLog = require("../models/ActivityLog");

router.get("/", async (req, res) => {
  res.json(await ActivityLog.find());
});

router.get("/user/:userId", async (req, res) => {
  res.json(await ActivityLog.find({ user_id: req.params.userId }));
});

module.exports = router;
