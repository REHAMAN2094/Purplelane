const multer = require("multer");

// Store file in memory (buffer)
const storage = multer.memoryStorage();

// Allowed mime types
const allowedMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/jpg",
  "application/pdf"
];

const upload = multer({
  storage: storage,

  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max per file
    files: 10 // max 10 files per request
  },

  fileFilter: (req, file, cb) => {
    console.log("Checking file:", file.originalname, file.mimetype);

    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPG, JPEG, PNG, and PDF files are allowed"), false);
    }
  }
});

module.exports = upload;
