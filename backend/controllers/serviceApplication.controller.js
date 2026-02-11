const ServiceApplication = require("../models/ServiceApplication");
const Service = require("../models/Service");
const Citizen = require("../models/Citizen");



/**
 * APPLY FOR SERVICE (Citizen)
 */
exports.applyForService = async (req, res) => {
    try {
        const { service_id, form_data } = req.body;

        // 1. Resolve Citizen profile using req.user.id (from JWT)
        const citizen = await Citizen.findOne({ login_id: req.user.id });
        if (!citizen) {
            return res.status(404).json({
                success: false,
                message: "Citizen profile not found. Please complete your profile first."
            });
        }

        // Verify service exists
        const service = await Service.findById(service_id);
        if (!service) {
            return res.status(404).json({
                success: false,
                message: "Service not found"
            });
        }

        // Handle uploaded documents
        let documents = [];

        if (req.files && req.files.length > 0) {
            documents = req.files.map(file => ({
                file_name: file.originalname,
                file_type: file.mimetype,
                data: file.buffer
            }));
        }

        const application = await ServiceApplication.create({
            service_id,
            citizen_id: citizen._id,
            citizen_name: citizen.name,
            application_no: "SVC" + Date.now(),
            form_data: form_data ? JSON.parse(form_data) : {},
            documents: documents
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
            .select("-documents.data") // ❌ exclude document bytes for list
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
        // Resolve Citizen profile
        const citizen = await Citizen.findOne({ login_id: req.user.id });
        if (!citizen) {
            return res.status(404).json({
                success: false,
                message: "Citizen profile not found."
            });
        }

        const applications = await ServiceApplication.find({
            citizen_id: citizen._id
        })
            .populate("service_id", "name category processing_days")
            .populate("verified_by", "name")
            .select("-documents.data") // ❌ exclude document bytes for list
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

        // Security check for Citizens: Only allowed to view their own application
        if (req.user.role === "Citizen") {
            const citizen = await Citizen.findOne({ login_id: req.user.id });
            if (!citizen || !application.citizen_id.equals(citizen._id)) {
                return res.status(403).json({
                    success: false,
                    message: "Unauthorized access to this application"
                });
            }
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

        // Validate status (Unified Flow)
        const validStatuses = ["Submitted", "In Progress", "Resolved", "Rejected"];
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

/**
 * GET SERVICE APPLICATION DOCUMENT
 */
exports.getServiceApplicationDocument = async (req, res) => {
    try {
        const { id, index } = req.params;
        const application = await ServiceApplication.findById(id);

        if (!application || !application.documents || !application.documents[index]) {
            return res.status(404).json({ message: "Document not found" });
        }

        const document = application.documents[index];
        res.set("Content-Type", document.file_type);
        res.send(document.data);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

