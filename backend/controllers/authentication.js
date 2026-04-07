const Login = require("../models/Login");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
require("dotenv").config();

// Initialize transporter for nodemailer
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Temporary storage for OTPs (in production, use Redis or database)
let otpStore = {};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await Login.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // update last login
    user.last_login = new Date();
    await user.save();

    // create token
    const token = jwt.sign(
      {
        id: user._id,
        role: user.user_type
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      role: user.user_type
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore[email] = otp;

    // Send OTP via email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset OTP - Digital Village",
      html: `
        <h2>Password Reset Request</h2>
        <p>Your OTP for password reset is:</p>
        <h3>${otp}</h3>
        <p>This OTP will expire in 15 minutes.</p>
        <p>Do not share this code with anyone.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    // Set OTP expiration (15 minutes)
    setTimeout(() => {
      delete otpStore[email];
    }, 15 * 60 * 1000);

    res.status(200).json({ 
      message: "Reset link sent to your email",
      success: true 
    });

  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ 
      message: "Error sending reset link. Please try again.",
      error: error.message 
    });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    if (otpStore[email] === otp) {
      res.status(200).json({ 
        message: "OTP verified successfully",
        success: true 
      });
    } else {
      res.status(400).json({ 
        message: "Invalid OTP",
        success: false 
      });
    }

  } catch (error) {
    res.status(500).json({ 
      message: "Error verifying OTP",
      error: error.message 
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Verify OTP
    if (otpStore[email] !== otp) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Find user by email
    const user = await Login.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    user.password_hash = hashedPassword;
    await user.save();

    // Clear OTP
    delete otpStore[email];

    res.status(200).json({ 
      message: "Password reset successful",
      success: true 
    });

  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ 
      message: "Error resetting password",
      error: error.message 
    });
  }
};
