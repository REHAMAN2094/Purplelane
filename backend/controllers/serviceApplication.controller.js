const ServiceApplication = require("../models/ServiceApplication");
const Service = require("../models/Service");

/**
 * APPLY FOR SERVICE (Citizen)
 */
exports.applyForService = async (req, res) => {
    try {
        const { service_id, form_data } = req.body;

        // Verify service exists
        const service = await Service.findById(service_id);
        if (!service) {
            return res.status(404).json({
                success: false,
                message: "Service not found"
            });
        }

        const application = await ServiceApplication.create({
            service_id,
            citizen_id: req.user.id,
            application_no: "SVC" + Date.now(),
            form_data: form_data || {}
        });

        res.status(201).json({
            success: true,
            message: "Application submitted successfully",
            data: application
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * GET ALL SERVICE APPLICATIONS (Employee/Admin)
 */
exports.getAllApplications = async (req, res) => {
    try {
        const applications = await ServiceApplication.find()
            .populate("service_id", "name category")
            .populate("citizen_id", "name phone")
            .populate("verified_by", "name")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: "Applications retrieved successfully",
            data: applications
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * GET MY APPLICATIONS (Citizen)
 */
exports.getMyApplications = async (req, res) => {
    try {
        const applications = await ServiceApplication.find({
            citizen_id: req.user.id
        })
            .populate("service_id", "name category processing_days")
            .populate("verified_by", "name")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: "Your applications retrieved successfully",
            data: applications
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * GET APPLICATION BY ID
 */
exports.getApplicationById = async (req, res) => {
    try {
        const application = await ServiceApplication.findById(req.params.id)
            .populate("service_id")
            .populate("citizen_id", "name phone email")
            .populate("verified_by", "name");

        if (!application) {
            return res.status(404).json({
                success: false,
                message: "Application not found"
            });
        }

        res.status(200).json({
            success: true,
            data: application
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * UPDATE APPLICATION STATUS (Employee/Admin)
 */
exports.updateApplicationStatus = async (req, res) => {
    try {
        const { status, remarks } = req.body;

        // Validate status
        const validStatuses = ["Submitted", "Under Verification", "Approved", "Rejected"];
        if (status && !validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status. Must be one of: " + validStatuses.join(", ")
            });
        }

        const application = await ServiceApplication.findById(req.params.id);

        if (!application) {
            return res.status(404).json({
                success: false,
                message: "Application not found"
            });
        }

        // Update fields
        if (status) application.status = status;
        if (remarks) application.remarks = remarks;
        application.verified_by = req.user.id;

        await application.save();

        res.status(200).json({
            success: true,
            message: "Application status updated successfully",
            data: application
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
