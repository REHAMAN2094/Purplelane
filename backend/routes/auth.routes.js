const express = require("express");
const router = express.Router();

const {
  login,
  forgotPassword,
  verifyOtp,
  resetPassword,
} = require("../controllers/authentication");

// Login
router.post("/login", login);

// Forgot Password - Send OTP
router.post("/forgot-password", forgotPassword);

// Verify OTP
router.post("/verify-otp", verifyOtp);

// Reset Password
router.post("/reset-password", resetPassword);

module.exports = router;
