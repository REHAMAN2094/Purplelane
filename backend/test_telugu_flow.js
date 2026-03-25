const { chatbotReply } = require("./controllers/chatbotController");

// Mocking the request and response objects
const req = {
  body: {
    message: "నా అప్లికేషన్ స్టేటస్ ఏంటి", // What is my application status? (Telugu)
    language: "en"
  },
  user: { id: "698ec6332f59e43033e1c0f6" }
};

const res = {
  json: (data) => console.log("Final Response:", JSON.stringify(data, null, 2)),
  status: (code) => ({ json: (data) => console.log(`Error ${code}:`, data) })
};

async function testTeluguFlow() {
  console.log("Testing Telugu Translation Flow...");
  await chatbotReply(req, res);
}

// Since chatbotReply uses MongoDB and external APIs, this needs a real environment or more mocks.
// But I'll try to run it with the existing environment setup.
require("dotenv").config();
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI).then(() => {
  testTeluguFlow().then(() => mongoose.disconnect());
});
