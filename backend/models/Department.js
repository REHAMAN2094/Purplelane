const mongoose = require("mongoose");

const DepartmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  description: {
    type: String
  },

  contact_email: {
    type: String
  },

  contact_phone: {
    type: String
  },

  // 🔑 Admin who created this department
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Login",   // Admin is stored in Login table
    required: true
  }

}, { timestamps: true });

module.exports = mongoose.model("Department", DepartmentSchema);
