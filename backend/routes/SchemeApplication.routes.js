const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");
const upload = require("../middleware/uploadImage");

const {
  applyScheme,
  updateSchemeStatus,
  getMySchemeApplications,
  getAllSchemeApplications,
  getSchemeApplicationDocument
} = require("../controllers/scheme.controller");


// citizen apply
router.post(
  "/apply",
  authenticate,
  authorize("Citizen"),
  (req, res, next) => {
    console.log("Entering /apply route, citizen_id:", req.user.id);
    upload.array("documents", 5)(req, res, (err) => {
      if (err) {
        console.error("Multer Error in /apply:", err);
        if (err instanceof require("multer").MulterError) {
          return res.status(400).json({ message: `Upload error: ${err.message}` });
        }
        return res.status(400).json({ message: err.message });
      }
      console.log("Multer upload success, proceeding to applyScheme");
      next();
    });
  },
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

// employee view specific document
router.get(
  "/:id/document/:index",
  authenticate,
  authorize("Employee", "Admin"),
  getSchemeApplicationDocument
);

module.exports = router;
