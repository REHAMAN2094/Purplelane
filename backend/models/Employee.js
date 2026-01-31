const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema({
  name: String,
  designation: String,
  department_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department"
  },
  phone: String,
  email: String,
  role: {
    type: String,
    enum: ["Clerk", "Officer", "Supervisor", "Admin"]
  },
  is_active: {
    type: Boolean,
    default: true
  },
  login_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Login"
  }
}, { timestamps: true });

module.exports = mongoose.model("Employee", EmployeeSchema);
