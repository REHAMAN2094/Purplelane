const User = require("../models/User"); // ✅ make sure this exists
const sendTelegramNotification = require("../notificationservice");

const registerUser = async (req, res) => {
  try {
    const { name, username, password, telegramId } = req.body;

    // ✅ SAVE USER IN DB (VERY IMPORTANT)
    const user = await User.create({
      name,
      username,
      password,
      telegramId,
    });

    // ✅ SEND TELEGRAM MESSAGE
    if (telegramId) {
      await sendTelegramNotification(
        telegramId,
        `👋 *Welcome to Purplelane!*\nDear ${name}, your registration was successful.`
      );
    }

    res.status(201).json({
      success: true,
      message: "Registration successful",
      user,
    });

  } catch (error) {
    console.log("Register Error:", error);
    res.status(500).json({
      success: false,
      message: "Registration failed",
      error: error.message,
    });
  }
};

module.exports = { registerUser };