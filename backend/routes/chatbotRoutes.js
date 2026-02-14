const express = require("express");
const router = express.Router();
const { chatbotReply, handleSTT } = require("../controllers/chatbotController");
const multer = require("multer");
const upload = multer();

router.post("/chat", chatbotReply);
router.post("/stt", upload.single("file"), handleSTT);

module.exports = router;
