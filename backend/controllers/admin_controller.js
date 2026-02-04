const Login = require("../models/Login");
const bcrypt = require("bcryptjs");

/**
 * CREATE ADMIN
 * Only for initial setup / super admin
 */
exports.createAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    // check if admin already exists
    const existingAdmin = await Login.findOne({
      username,
      user_type: "Admin"
    });

    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const admin = await Login.create({
      username,
      password_hash,
      user_type: "Admin"
    });

    res.status(201).json({
      message: "Admin created successfully",
      adminId: admin._id
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createService = async (req, res) => {
  if (req.user.role !== "Admin") {
    return res.status(403).json({ message: "Admin only" });
  }

  const service = await Service.create({
    ...req.body,
    created_by: req.user.id
  });

  res.status(201).json(service);
};
