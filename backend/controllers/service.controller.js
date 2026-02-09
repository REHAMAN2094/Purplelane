const Service = require("../models/Service");

/**
 * CREATE SERVICE (Admin)
 */
exports.createService = async (req, res) => {
    try {
        const {
            name,
            category,
            description,
            required_documents,
            processing_days
        } = req.body;

        const service = await Service.create({
            name,
            category,
            description,
            required_documents,
            processing_days,
            created_by: req.user.id
        });

        res.status(201).json({
            success: true,
            message: "Service created successfully",
            service
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * GET ALL SERVICES
 */
exports.getAllServices = async (req, res) => {
    try {
        const services = await Service.find({ is_active: true })
            .populate("created_by", "username")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: services.length,
            services
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * GET SERVICE BY ID
 */
exports.getServiceById = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id)
            .populate("created_by", "username");

        if (!service) {
            return res.status(404).json({
                success: false,
                message: "Service not found"
            });
        }

        res.status(200).json({
            success: true,
            service
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * UPDATE SERVICE (Admin)
 */
exports.updateService = async (req, res) => {
    try {
        const {
            name,
            category,
            description,
            required_documents,
            processing_days,
            is_active
        } = req.body;

        const service = await Service.findById(req.params.id);

        if (!service) {
            return res.status(404).json({
                success: false,
                message: "Service not found"
            });
        }

        // Update fields
        if (name) service.name = name;
        if (category) service.category = category;
        if (description) service.description = description;
        if (required_documents) service.required_documents = required_documents;
        if (processing_days) service.processing_days = processing_days;
        if (typeof is_active !== 'undefined') service.is_active = is_active;

        await service.save();

        res.status(200).json({
            success: true,
            message: "Service updated successfully",
            service
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * DELETE SERVICE (Admin - soft delete)
 */
exports.deleteService = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);

        if (!service) {
            return res.status(404).json({
                success: false,
                message: "Service not found"
            });
        }

        service.is_active = false;
        await service.save();

        res.status(200).json({
            success: true,
            message: "Service deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
