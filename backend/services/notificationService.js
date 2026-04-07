const axios = require("axios");

const sendTelegramNotification = async (chatId, message) => {
  const token = process.env.BOT_TOKEN;

  try {
    const response = await axios.post(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        chat_id: chatId,
        text: message,
        parse_mode: "Markdown", // ✅ for bold text (*text*)
      }
    );

    console.log("✅ Telegram message sent:", response.data);
  } catch (error) {
    console.log("❌ Telegram error:", error.response?.data || error.message);
  }
};

module.exports = sendTelegramNotification;