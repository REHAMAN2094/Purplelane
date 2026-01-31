const mongoose = require("mongoose");

const LoginSchema = new mongoose.Schema({
  username: String,
  password_hash: String,
  user_type: {
    type: String,
    enum: ["Citizen", "Employee", "Admin"]
  },
  last_login: Date
}, { timestamps: true });

module.exports = mongoose.model("Login", LoginSchema);
