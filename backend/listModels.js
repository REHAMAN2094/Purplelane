require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');

async function listModels() {
    try {
        console.log("Checking available models...");

        // Using REST API as SDK method vary by version
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.gemini_api_key}`);
        const data = await response.json();

        if (data.models) {
            let output = "Available Models:\n";
            data.models.forEach(m => {
                if (m.name.includes("embed")) {
                    output += `- ${m.name} (Supported methods: ${m.supportedGenerationMethods})\n`;
                }
            });
            fs.writeFileSync('available_models.txt', output);
            console.log("Models written to available_models.txt");
            console.log(output);
        } else {
            console.log("Could not list models via REST:", data);
            fs.writeFileSync('available_models.txt', JSON.stringify(data, null, 2));
        }

    } catch (error) {
        console.error("Error listing models:", error);
        fs.writeFileSync('available_models.txt', `Error: ${error.message}`);
    }
}

listModels();
