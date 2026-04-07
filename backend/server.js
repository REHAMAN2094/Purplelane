require("dotenv").config({ path: __dirname + "/.env" });

console.log("🚀 Starting server...");

const app = require("./app");
console.log("✅ App loaded");

const connectDB = require("./config/db");
console.log("✅ DB config loaded");

// Connect DB
connectDB();

// Define PORT safely
const PORT = process.env.PORT || 5001;

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});