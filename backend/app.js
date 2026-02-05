const cors = require("cors");
const express = require("express");
const app = express();

// middleware
app.use(cors());
app.use(express.json());

// routes
app.use("/api/admin", require("./routes/admin.routes"));
app.use("/api/citizens", require("./routes/citizen.routes"));

app.use("/api/schemes", require("./routes/scheme.routes"));
// app.use("/api/applications", require("./routes/SchemeApplication.routes"));
app.use("/api/complaints", require("./routes/complaint.routes"));

app.use("/api/feedback", require("./routes/feedback.routes"));



app.use("/api/employees", require("./routes/employee.routes"));
app.use("/api/scheme-applications", require("./routes/SchemeApplication.routes")); // Ensure consistent naming
// app.use("/api/documents", require("./routes/document.routes"));
// app.use("/api/notifications", require("./routes/notification.routes"));
// app.use("/api/logs", require("./routes/activity.routes"));
app.use("/api/services", require("./routes/admin.routes")); // Assuming createService is in admin.routes

module.exports = app;
