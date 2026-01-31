const express = require("express");
const router = express.Router();
const VoiceQuery = require("../models/VoiceQuery");

router.post("/query", async (req, res) => {
  const { text, citizen_id } = req.body;

  const intent =
    text.includes("status") ? "ApplicationStatus" :
    text.includes("complaint") ? "Complaint" : "General";

  const log = await VoiceQuery.create({
    citizen_id,
    query_text: text,
    detected_intent: intent,
    action_performed: "Processed"
  });

  res.json({ intent, message: "Voice query processed", log });
});

module.exports = router;
