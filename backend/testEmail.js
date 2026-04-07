const express = require("express");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");

const app = express();
app.use(express.json());

// Temporary storage (for learning)
let otpStore = {};

// Email transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "sravanisravani43206@gmail.com",
    pass: "hkdoihgxfxlhbxrf", // replace with your app password
  },
});


// ✅ 1. Forgot Password (Send OTP)
app.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  const otp = Math.floor(100000 + Math.random() * 900000);

  otpStore[email] = otp;

  try {
    await transporter.sendMail({
      from: "sravanisravani43206@gmail.com",
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP is ${otp}`,
    });

    res.json({ message: "OTP sent to email" });
  } catch (err) {
    res.status(500).json({ error: "Email failed" });
  }
});


// ✅ 2. Verify OTP
app.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;

  if (otpStore[email] == otp) {
    res.json({ message: "OTP verified" });
  } else {
    res.status(400).json({ message: "Invalid OTP" });
  }
});


// ✅ 3. Reset Password
app.post("/reset-password", async (req, res) => {
  const { email, newPassword } = req.body;

  if (!otpStore[email]) {
    return res.status(400).json({ message: "OTP not verified" });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  console.log("Saved password (hashed):", hashedPassword);

  delete otpStore[email];

  res.json({ message: "Password reset successful" });
});


// Start server
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});

