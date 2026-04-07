const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    let token = null;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } else if (req.query.token) {
      token = req.query.token;
      console.log("Token received via query parameter");
    }

    if (!token) {
      console.log("Error: Authentication token missing or malformed");
      return res.status(401).json({
        message: "Authorization token missing"
      });
    }

    console.log("Token extracted:", token);

    // ✅ VERIFY TOKEN
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ attach user info
    req.user = decoded;

    next(); // 👉 VERY IMPORTANT

  } catch (error) {
    console.log("JWT Error:", error.message);
    return res.status(401).json({
      message: "Invalid token"
    });
  }
};