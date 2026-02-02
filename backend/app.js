const express = require("express");
const app = express();

// middleware
app.use(express.json());

// routes
app.use("/api/admin", require("./routes/admin.routes"));
app.use("/api/citizens", require("./routes/citizen.routes"));

app.use("/api/schemes", require("./routes/scheme.routes"));



// (uncomment later when ready)
// app.use("/api/applications", require("./routes/application.routes"));
// app.use("/api/complaints", require("./routes/complaint.routes"));
// app.use("/api/voice", require("./routes/voice.routes"));
// app.use("/api/employees", require("./routes/employee.routes"));
// app.use("/api/scheme-applications", require("./routes/SchemeApplication.routes"));
// app.use("/api/documents", require("./routes/document.routes"));
// app.use("/api/notifications", require("./routes/notification.routes"));
// app.use("/api/logs", require("./routes/activity.routes"));

module.exports = app;
