const Complaint = require("../models/Complaint");
const Citizen = require("../models/Citizen"); // ✅ IMPORTANT
const sendTelegramNotification = require("../services/notificationService");

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

    const complaintNo = "CMP" + Date.now();

    const complaint = await Complaint.create({
      citizen_id: req.user.id,
      title,
      description,
      category,
      priority,
      location,
      village,
      complaint_no: complaintNo,
      attachments
    });

    // ✅ FETCH TELEGRAM ID FROM DB (IMPORTANT FIX)
    const citizen = await Citizen.findById(req.user.id);
    const telegramId = citizen?.telegramId;

    console.log("Telegram ID:", telegramId); // debug

    // ✅ SEND TELEGRAM MESSAGE
    if (telegramId) {
      await sendTelegramNotification(
        telegramId,
        `📄 *Complaint Submitted*\n\nYour complaint *"${title}"* (${complaintNo}) has been submitted successfully.`
      );
    }

    res.status(201).json({
      message: "Complaint submitted successfully",
      complaint_id: complaint._id,
      complaint_no: complaint.complaint_no
    });

  } catch (error) {
    console.log("Create Complaint Error:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * GET COMPLAINT DETAILS
 */
exports.getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id).select("-attachments.data");

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
 */
exports.getAllComplaints = async (req, res) => {
  try {
    let filter = {};

    if (req.user.role === "Citizen") {
      filter.citizen_id = req.user.id;
    }

    const complaints = await Complaint.find(filter)
      .select("-attachments.data")
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
      message: error.message
    });
  }
};

/**
 * GET COMPLAINT ATTACHMENT
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
 * UPDATE COMPLAINT STATUS
 */
exports.updateComplaintStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, remarks } = req.body;

    const validStatuses = ['Submitted', 'In Progress', 'Resolved'];

    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const complaint = await Complaint.findById(id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }

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