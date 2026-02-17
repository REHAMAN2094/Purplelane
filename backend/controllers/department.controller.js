const Department = require("../models/Department");
const Login = require("../models/Login");

exports.createDepartment = async (req, res) => {
  try {
    const { name, description, contact_email, contact_phone, admin_id } = req.body;

    // 🔐 check admin exists and is ADMIN
    const admin = await Login.findOne({
      _id: admin_id,
      user_type: "Admin"
    });

    if (!admin) {
      return res.status(403).json({
        message: "Only admin can create department"
      });
    }

    // ❌ check duplicate department
    const existingDept = await Department.findOne({ name });
    if (existingDept) {
      return res.status(400).json({
        message: "Department already exists"
      });
    }

    // ✅ create department
    const department = await Department.create({
      name,
      description,
      contact_email,
      contact_phone,
      created_by: admin_id
    });

    res.status(201).json({
      message: "Department created successfully",
      department
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};



/**
 * GET ALL DEPARTMENTS
 */
exports.getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.find()
      .populate("created_by", "username user_type") // admin details
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: departments.length,
      departments
    });
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

/**
 * GET DEPARTMENT BY ID
 */
exports.getDepartmentById = async (req, res) => {
  try {
    const { id } = req.params;

    const department = await Department.findById(id)
      .populate("created_by", "username user_type");

    if (!department) {
      return res.status(404).json({
        message: "Department not found"
      });
    }

    res.status(200).json(department);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

/**
 * UPDATE DEPARTMENT
 */
exports.updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, contact_email, contact_phone } = req.body;

    const department = await Department.findByIdAndUpdate(
      id,
      { name, description, contact_email, contact_phone },
      { new: true }
    ).populate("created_by", "username user_type");

    if (!department) {
      return res.status(404).json({
        message: "Department not found"
      });
    }

    res.status(200).json({
      message: "Department updated successfully",
      department
    });
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

/**
 * DELETE DEPARTMENT
 */
exports.deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;

    const department = await Department.findByIdAndDelete(id);

    if (!department) {
      return res.status(404).json({
        message: "Department not found"
      });
    }

    res.status(200).json({
      message: "Department deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};
