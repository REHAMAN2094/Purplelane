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
exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find()
      .populate("department_id", "name description")
      .populate("login_id", "username user_type")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: employees.length,
      employees
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

exports.getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await Employee.findById(id)
      .populate("department_id", "name description")
      .populate("login_id", "username user_type");

    if (!employee) {
      return res.status(404).json({
        message: "Employee not found"
      });
    }

    res.status(200).json(employee);

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

exports.updateServiceStatus = async (req, res) => {
  if (req.user.role !== "Employee") {
    return res.status(403).json({ message: "Employee only" });
  }

  const application = await ServiceApplication.findByIdAndUpdate(
    req.params.id,
    {
      status: req.body.status,
      remarks: req.body.remarks,
      verified_by: req.user.id
    },
    { new: true }
  );

  res.json(application);
};
