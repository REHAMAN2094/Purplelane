const express = require("express");
const router = express.Router();
const SchemeApplication = require("../models/SchemeApplication");
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");

const {
  applyScheme,
  updateSchemeStatus,
  getMySchemeApplications,
  getAllSchemeApplications
} = require("../controllers/scheme.controller");
const upload = require("../middleware/uploadImage");

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



// citizen apply
router.post(
  "/apply",
  authenticate,
  authorize("Citizen"),
  upload.array("documents", 5), // max 5 files
  applyScheme
);

// citizen view own applications
router.get(
  "/my",
  authenticate,
  authorize("Citizen"),
  getMySchemeApplications
);

// employee view all applications
router.get(
  "/",
  authenticate,
  authorize("Employee"),
  getAllSchemeApplications
);

// employee verify / reject
router.put(
  "/:id/status",
  authenticate,
  authorize("Employee"),
  updateSchemeStatus
);




module.exports = router;
