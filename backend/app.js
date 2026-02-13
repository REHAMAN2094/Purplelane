const cors = require("cors");
const express = require("express");
const app = express();
const morgan = require("morgan");

// middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// routes
app.use("/api/admin", require("./routes/admin.routes"));
app.use("/api/citizens", require("./routes/citizen.routes"));

app.use("/api/scheme", require("./routes/scheme.routes"));
app.use("/api/complaints", require("./routes/complaint.routes"));

app.use("/api/feedback", require("./routes/feedback.routes"));

app.use("/api/employees", require("./routes/employee.routes"));
app.use("/api/scheme-applications", require("./routes/SchemeApplication.routes"));

// Service routes
app.use("/api/services", require("./routes/service.routes"));
app.use("/api/service-applications", require("./routes/serviceApplication.routes"));
app.use("/api/stats", require("./routes/stats.routes"));

// chatbot routes
app.use("/api/chatbot", require("./routes/chatbotRoutes"));

// Global error handler
app.use((err, req, res, next) => {
    console.error("Global Error Handler Catch:", err);
    res.status(err.status || 400).json({
        success: false,
        message: err.message || "An unexpected error occurred",
        error: process.env.NODE_ENV === "development" ? err : {}
    });
});

module.exports = app;
