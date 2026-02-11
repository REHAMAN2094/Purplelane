const Citizen = require("../models/Citizen");
const Login = require("../models/Login");
const bcrypt = require("bcryptjs");

/**
 * CREATE CITIZEN (Registration)
 */
exports.createCitizen = async (req, res) => {
  try {
    const {
      name,
      gender,
      dob,
      phone,
      email,
      address,
      identity,
      username,
      password
    } = req.body;

    // ❌ Check duplicate username
    const existingLogin = await Login.findOne({ username });
    if (existingLogin) {
      return res.status(400).json({
        message: "Username already exists"
      });
    }

    // ❌ Check duplicate Aadhaar (optional but recommended)
    if (identity?.aadhar) {
      const existingCitizen = await Citizen.findOne({
        "identity.aadhar": identity.aadhar
      });

      if (existingCitizen) {
        return res.status(400).json({
          message: "Citizen with this Aadhaar already exists"
        });
      }
    }

    // 🔐 Create login
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const login = await Login.create({
      username,
      password_hash,
      user_type: "Citizen"
    });

    // 👤 Create citizen profile
    const citizen = await Citizen.create({
      name,
      gender,
      dob,
      phone,
      email,
      address,
      identity,
      login_id: login._id
    });

    res.status(201).json({
      message: "Citizen registered successfully",
      citizen
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

/**
 * GET ALL CITIZENS
 */
exports.getAllCitizens = async (req, res) => {
  try {
    const citizens = await Citizen.find()
      .populate("login_id", "username user_type")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: citizens.length,
      citizens
    });
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

/**
 * GET CITIZEN BY ID
 */
exports.getCitizenById = async (req, res) => {
  try {
    const { id } = req.params;

    // Search by both internal _id and login_id
    const citizen = await Citizen.findOne({
      $or: [
        { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null },
        { login_id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }
      ].filter(q => Object.values(q)[0] !== null)
    }).populate("login_id", "username user_type");

    if (!citizen) {
      return res.status(404).json({
        message: "Citizen not found"
      });
    }

    res.status(200).json(citizen);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

/**
 * UPDATE CITIZEN PROFILE
 */
exports.updateCitizen = async (req, res) => {
  try {
    const { id } = req.params;

    // First find the citizen to ensure we have the right document
    const citizenCheck = await Citizen.findOne({
      $or: [
        { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null },
        { login_id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }
      ].filter(q => Object.values(q)[0] !== null)
    });

    if (!citizenCheck) {
      return res.status(404).json({
        message: "Citizen not found"
      });
    }

    const citizen = await Citizen.findByIdAndUpdate(
      citizenCheck._id,
      req.body,
      { new: true }
    );

    res.status(200).json({
      message: "Citizen updated successfully",
      citizen
    });
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

/**
 * DELETE CITIZEN (Optional)
 */
exports.deleteCitizen = async (req, res) => {
  try {
    const { id } = req.params;

    const citizen = await Citizen.findByIdAndDelete(id);

    if (!citizen) {
      return res.status(404).json({
        message: "Citizen not found"
      });
    }

    // Also delete login
    await Login.findByIdAndDelete(citizen.login_id);

    res.status(200).json({
      message: "Citizen deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};


exports.applyService = async (req, res) => {
  const application = await ServiceApplication.create({
    service_id: req.body.service_id,
    citizen_id: req.user.id,
    form_data: req.body.form_data,
    application_no: "APP" + Date.now()
  });

  res.status(201).json(application);
};
