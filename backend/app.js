const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const app = express();

// ================== MIDDLEWARE ==================

// ✅ FIXED CORS (IMPORTANT)
app.use(cors({
  origin: "http://localhost:8080",  // frontend port
  credentials: true
}));

// ✅ Parse JSON
app.use(express.json());

// ✅ Logging
app.use(morgan("dev"));


// ================== ROUTES ==================

app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/admin", require("./routes/admin.routes"));
app.use("/api/citizens", require("./routes/citizen.routes"));
app.use("/api/scheme", require("./routes/scheme.routes"));
app.use("/api/complaints", require("./routes/complaint.routes"));
app.use("/api/feedback", require("./routes/feedback.routes"));
app.use("/api/employees", require("./routes/employee.routes"));
app.use("/api/scheme-applications", require("./routes/SchemeApplication.routes"));
app.use("/api/services", require("./routes/service.routes"));
app.use("/api/service-applications", require("./routes/serviceApplication.routes"));


// ================== HEALTH CHECK ==================

app.get("/", (req, res) => {
  res.send("API is running 🚀");
});


// ================== GLOBAL ERROR HANDLER ==================

app.use((err, req, res, next) => {
  console.error("Global Error Handler Catch:", err);

  res.status(err.status || 400).json({
    success: false,
    message: err.message || "An unexpected error occurred",
    error: process.env.NODE_ENV === "development" ? err : {}
  });
});


module.exports = app;