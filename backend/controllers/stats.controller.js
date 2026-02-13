const Citizen = require("../models/Citizen");
const Scheme = require("../models/Scheme");
const Complaint = require("../models/Complaint");
const SchemeApplication = require("../models/SchemeApplication");
const ServiceApplication = require("../models/ServiceApplication");
const Department = require("../models/Department");
const Employee = require("../models/Employee");

exports.getAdminStats = async (req, res) => {
  try {
    const totalCitizens = await Citizen.countDocuments();
    const totalSchemes = await Scheme.countDocuments({ is_active: true });

    // Combining Scheme and Service applications for "Pending"
    const pendingSchemeApps = await SchemeApplication.countDocuments({ status: "Submitted" });
    const pendingServiceApps = await ServiceApplication.countDocuments({ status: "Submitted" });
    const totalPendingApplications = pendingSchemeApps + pendingServiceApps;

    const resolvedComplaints = await Complaint.countDocuments({ status: "Resolved" });
    const totalDepartments = await Department.countDocuments();
    const totalEmployees = await Employee.countDocuments();

    res.status(200).json({
      totalCitizens,
      totalSchemes,
      pendingApplications: totalPendingApplications,
      resolvedComplaints,
      totalDepartments,
      totalEmployees
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getEmployeeStats = async (req, res) => {
  try {
    const employee = await Employee.findOne({ login_id: req.user.id });
    if (!employee) {
      return res.status(404).json({ message: "Employee profile not found" });
    }

    // 1. Pending Applications (Global)
    // Note: Ideally this should be filtered by employee's department if schemes/services are mapped to departments.
    // Currently showing global pending count.
    const pendingSchemeApps = await SchemeApplication.countDocuments({ status: "Submitted" });
    const pendingServiceApps = await ServiceApplication.countDocuments({ status: "Submitted" });
    const totalPending = pendingSchemeApps + pendingServiceApps;

    // 2. Verified Today (Resolved + Rejected + Verified)
    // Counts all applications processed by this employee TODAY
    // Supporting both Employee ID (Correct) and Login ID (Legacy Data)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const userIds = [employee._id, req.user.id];

    const verifiedSchemes = await SchemeApplication.countDocuments({
      status: { $in: ["Resolved", "Rejected"] },
      verified_by: { $in: userIds },
      updatedAt: { $gte: today }
    });

    const verifiedServices = await ServiceApplication.countDocuments({
      status: { $in: ["Resolved", "Rejected"] },
      verified_by: { $in: userIds },
      updatedAt: { $gte: today }
    });

    // 3. Assigned / In Progress
    // Includes Complaints assigned to employee AND Applications being verified by employee
    const assignedComplaints = await Complaint.countDocuments({
      assigned_to: { $in: userIds },
      status: { $in: ["Assigned", "In Progress"] }
    });

    const inProgressSchemes = await SchemeApplication.countDocuments({
      status: "In Progress",
      verified_by: { $in: userIds }
    });

    const inProgressServices = await ServiceApplication.countDocuments({
      status: "In Progress",
      verified_by: { $in: userIds }
    });

    const totalAssigned = assignedComplaints + inProgressSchemes + inProgressServices;

    // 4. Resolved Till Date (Successfully Resolved)
    // Includes Complaints and Applications
    const resolvedComplaints = await Complaint.countDocuments({
      assigned_to: { $in: userIds },
      status: "Resolved"
    });

    const resolvedSchemes = await SchemeApplication.countDocuments({
      status: "Resolved",
      verified_by: { $in: userIds }
    });

    const resolvedServices = await ServiceApplication.countDocuments({
      status: "Resolved",
      verified_by: { $in: userIds }
    });

    const totalResolved = resolvedComplaints + resolvedSchemes + resolvedServices;

    res.status(200).json({
      pendingApplications: totalPending,
      verifiedToday: verifiedSchemes + verifiedServices,
      assignedComplaints: totalAssigned,
      resolvedComplaints: totalResolved
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCitizenStats = async (req, res) => {
  try {
    const citizen = await Citizen.findOne({ login_id: req.user.id });
    if (!citizen) {
      return res.status(404).json({ message: "Citizen profile not found" });
    }

    const totalSchemeApps = await SchemeApplication.countDocuments({ citizen_id: citizen._id });
    const totalServiceApps = await ServiceApplication.countDocuments({ citizen_id: citizen._id });

    const pendingSchemeApps = await SchemeApplication.countDocuments({
      citizen_id: citizen._id,
      status: { $in: ["Submitted", "In Progress"] }
    });
    const pendingServiceApps = await ServiceApplication.countDocuments({
      citizen_id: citizen._id,
      status: { $in: ["Submitted", "In Progress"] }
    });

    const resolvedSchemeApps = await SchemeApplication.countDocuments({
      citizen_id: citizen._id,
      status: "Resolved"
    });
    const resolvedServiceApps = await ServiceApplication.countDocuments({
      citizen_id: citizen._id,
      status: "Resolved"
    });

    const activeComplaints = await Complaint.countDocuments({
      citizen_id: citizen._id,
      status: { $nin: ["Resolved", "Closed"] }
    });

    res.status(200).json({
      totalApplications: totalSchemeApps + totalServiceApps,
      pendingApplications: pendingSchemeApps + pendingServiceApps,
      approvedApplications: resolvedSchemeApps + resolvedServiceApps,
      activeComplaints
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
