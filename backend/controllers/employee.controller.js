const Employee = require("../models/Employee");
const Department = require("../models/Department");
const Login = require("../models/Login");
const bcrypt = require("bcryptjs");

exports.createEmployee = async (req, res) => {
  try {
    const {
      name,
      designation,
      department_name,   // 👈 department name from req body
      phone,
      email,
      role,
      username,
      password,
      admin_id
    } = req.body;

    // 🔐 Verify admin
    const admin = await Login.findOne({
      _id: admin_id,
      user_type: "Admin"
    });

    if (!admin) {
      return res.status(403).json({
        message: "Only admin can create employee"
      });
    }

    // 🏢 Find department by NAME
    const department = await Department.findOne({
      name: department_name
    });

    if (!department) {
      return res.status(404).json({
        message: "Department does not exist"
      });
    }

    // ❌ Check duplicate login
    const existingLogin = await Login.findOne({ username });
    if (existingLogin) {
      return res.status(400).json({
        message: "Username already exists"
      });
    }

    // 🔐 Create login for employee
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const login = await Login.create({
      username,
      password_hash,
      user_type: "Employee"
    });

    // 👤 Create employee with department_id from DB
    const employee = await Employee.create({
      name,
      designation,
      department_id: department._id, // 👈 mapped internally
      phone,
      email,
      role,
      login_id: login._id
    });

    res.status(201).json({
      message: "Employee created successfully",
      employee,
      department: {
        id: department._id,
        name: department.name
      }
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};
