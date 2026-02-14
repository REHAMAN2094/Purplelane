const express = require("express");
const router = express.Router();
const statsController = require("../controllers/stats.controller");
const authenticate = require("../middleware/authenticate");

// All stats routes require authentication
router.use(authenticate);

router.get("/admin", statsController.getAdminStats);
router.get("/employee", statsController.getEmployeeStats);
router.get("/citizen", statsController.getCitizenStats);

module.exports = router;
