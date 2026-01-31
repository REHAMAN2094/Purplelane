const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");

router.get("/:userId", async (req, res) => {
  res.json(await Notification.find({ user_id: req.params.userId }));
});

router.put("/:id/read", async (req, res) => {
  res.json(
    await Notification.findByIdAndUpdate(
      req.params.id,
      { is_read: true },
      { new: true }
    )
  );
});

module.exports = router;
