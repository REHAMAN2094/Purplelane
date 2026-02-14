const Complaint = require("../models/Complaint");
const { generateRAGResponse, translateWithSarvam } =
  require("../services/aiService");


/**
 * CREATE COMPLAINT (Citizen)
 */
exports.createComplaint = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      priority,
      location,
      village
    } = req.body;

    const attachments = [];

    if (req.files) {
      req.files.forEach(file => {
        attachments.push({
          file_name: file.originalname,
          file_type: file.mimetype,
          data: file.buffer
        });
      });
    }

    const complaint = await Complaint.create({
      citizen_id: req.user.id, // from JWT
      title,
      description,
      category,
      priority,
      location,
      village,
      complaint_no: "CMP" + Date.now(),
      attachments
    });

    res.status(201).json({
      message: "Complaint submitted successfully",
      complaint_id: complaint._id,
      complaint_no: complaint.complaint_no
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * GET COMPLAINT DETAILS (WITHOUT IMAGE DATA)
 */
exports.getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id).select(
      "-attachments.data"
    );

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    res.json(complaint);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * GET COMPLAINT IMAGE
 */
exports.getComplaintImage = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint || complaint.attachments.length === 0) {
      return res.status(404).json({ message: "Image not found" });
    }

    const image = complaint.attachments[0];

    res.set("Content-Type", image.file_type);
    res.send(image.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * GET ALL COMPLAINTS
 * (Images excluded for performance)
 */
exports.getAllComplaints = async (req, res) => {
  try {
    let filter = {};

    // Citizen sees only own complaints
    if (req.user.role === "Citizen") {
      filter.citizen_id = req.user.id;
    }

    const complaints = await Complaint.find(filter)
      .select("-attachments.data") // ❌ exclude image bytes
      .populate("citizen_id", "name")
      .populate("department_id", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Complaints retrieved successfully",
      data: complaints
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error.message
    });
  }
};


/**
 * GET COMPLAINT ATTACHMENT BY INDEX
 */
exports.getComplaintAttachment = async (req, res) => {
  try {
    const { id, index } = req.params;

    const complaint = await Complaint.findById(id);

    if (!complaint || !complaint.attachments.length) {
      return res.status(404).json({ message: "No attachments found" });
    }

    const attachment = complaint.attachments[index];

    if (!attachment) {
      return res.status(404).json({ message: "Attachment not found" });
    }

    res.set("Content-Type", attachment.file_type);
    res.send(attachment.data);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * UPDATE COMPLAINT STATUS (Employee/Admin)
 */
exports.updateComplaintStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, remarks } = req.body;

    // Validate status
    const validStatuses = ['Submitted', 'In Progress', 'Resolved'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be one of: ' + validStatuses.join(', ')
      });
    }

    const complaint = await Complaint.findById(id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }

    // Update fields
    if (status) complaint.status = status;
    if (remarks) complaint.remarks = remarks;

    await complaint.save();

    res.status(200).json({
      success: true,
      message: 'Complaint status updated successfully',
      data: complaint
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

