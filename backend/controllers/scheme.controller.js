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

const SchemeApplication = require("../models/SchemeApplication");

/**
 * CITIZEN → APPLY FOR SCHEME
 */


exports.applyScheme = async (req, res) => {
  try {
    console.log("Apply Scheme Request Body:", req.body);
    console.log("Apply Scheme Files Count:", req.files ? req.files.length : 0);

    if (req.user.role !== "Citizen") {
      return res.status(403).json({ message: "Only citizens can apply" });
    }

    const { scheme_id } = req.body;

    if (!scheme_id) {
      console.log("Error: scheme_id is missing");
      return res.status(400).json({ message: "scheme_id is required" });
    }

    // prevent duplicate application
    const alreadyApplied = await SchemeApplication.findOne({
      scheme_id,
      citizen_id: req.user.id
    });

    if (alreadyApplied) {
      console.log("Error: Already applied for this scheme", { scheme_id, citizen_id: req.user.id });
      return res.status(400).json({
        message: "You have already applied for this scheme"
      });
    }

    // convert uploaded files → buffer
    const documents = [];
    if (req.files) {
      req.files.forEach(file => {
        documents.push({
          file_name: file.originalname,
          file_type: file.mimetype,
          data: file.buffer
        });
      });
    }

    const application = await SchemeApplication.create({
      scheme_id,
      citizen_id: req.user.id,
      application_no: "SCH" + Date.now(),
      documents
    });

    res.status(201).json({
      success: true,
      message: "Scheme applied successfully",
      data: {
        application_no: application.application_no,
        application
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


/**
 * EMPLOYEE → VERIFY / REJECT SCHEME
 */
exports.updateSchemeStatus = async (req, res) => {
  try {
    if (req.user.role !== "Employee") {
      return res.status(403).json({ message: "Employee only" });
    }

    const { status, remarks } = req.body;

    if (!["Verified", "Rejected"].includes(status)) {
      return res.status(400).json({
        message: "Invalid status"
      });
    }

    const application = await SchemeApplication.findByIdAndUpdate(
      req.params.id,
      {
        status,
        remarks,
        verified_by: req.user.id
      },
      { new: true }
    );

    if (!application) {
      return res.status(404).json({
        message: "Application not found"
      });
    }

    res.json({
      success: true,
      message: "Scheme application updated",
      data: application
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * CITIZEN → VIEW MY SCHEME APPLICATIONS
 */
exports.getMySchemeApplications = async (req, res) => {
  try {
    const applications = await SchemeApplication.find({
      citizen_id: req.user.id
    })
      .populate("scheme_id", "name categories")
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * EMPLOYEE → VIEW ALL SCHEME APPLICATIONS
 */
exports.getAllSchemeApplications = async (req, res) => {
  try {
    if (req.user.role !== "Employee") {
      return res.status(403).json({ message: "Employee only" });
    }

    const applications = await SchemeApplication.find()
      .populate("scheme_id", "name")
      .populate("citizen_id", "name")
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
/**
 * GET SCHEME APPLICATION DOCUMENT
 */
exports.getSchemeApplicationDocument = async (req, res) => {
  try {
    const { id, index } = req.params;
    const application = await SchemeApplication.findById(id);

    if (!application || !application.documents || !application.documents[index]) {
      return res.status(404).json({ message: "Document not found" });
    }

    const document = application.documents[index];
    res.set("Content-Type", document.file_type);
    res.send(document.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
