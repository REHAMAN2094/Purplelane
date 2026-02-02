const Scheme = require("../models/Scheme");

/**
 * CREATE SCHEME (ADMIN ONLY)
 */
exports.createScheme = async (req, res) => {
  try {
    // role comes from JWT
    if (req.user.role !== "Admin") {
      return res.status(403).json({
        message: "Only admin can create schemes"
      });
    }

    // prevent duplicates
    const exists = await Scheme.findOne({ name: req.body.name });
    if (exists) {
      return res.status(400).json({
        message: "Scheme already exists"
      });
    }

    const scheme = await Scheme.create({
      ...req.body,
      created_by: req.user.id
    });

    res.status(201).json({
      message: "Scheme created successfully",
      scheme
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * UPDATE SCHEME (ADMIN ONLY)
 */
exports.updateScheme = async (req, res) => {
  try {
    if (req.user.role !== "Admin") {
      return res.status(403).json({
        message: "Only admin can update schemes"
      });
    }

    const scheme = await Scheme.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!scheme) {
      return res.status(404).json({
        message: "Scheme not found"
      });
    }

    res.status(200).json({
      message: "Scheme updated successfully",
      scheme
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * GET ALL SCHEMES (CITIZEN + EMPLOYEE + ADMIN)
 */
exports.getAllSchemes = async (req, res) => {
  try {
    const schemes = await Scheme.find({ is_active: true })
      .select("-__v")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: schemes.length,
      schemes
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * GET SCHEME BY ID (VIEW DETAILS MODAL)
 */
exports.getSchemeById = async (req, res) => {
  try {
    const scheme = await Scheme.findById(req.params.id);

    if (!scheme) {
      return res.status(404).json({
        message: "Scheme not found"
      });
    }

    res.status(200).json(scheme);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
