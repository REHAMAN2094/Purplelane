const cors = require("cors");
const express = require("express");
const app = express();

// middleware
app.use(cors());
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

module.exports = app;
