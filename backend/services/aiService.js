const { GoogleGenerativeAI } = require("@google/generative-ai");
const axios = require("axios");
const { index } = require("../utils/pineconeClient");
const { createEmbedding } = require("../utils/embedding");
const SchemeApplication = require("../models/schemeApplication");
const Complaints = require("../models/Complaint");
const Scheme = require("../models/Scheme");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 🔹 Query Pinecone
// 🔹 Query Pinecone (Schemes + Services)
async function searchPinecone(query) {
  try {
    const embedding = await createEmbedding(query);

    // Query both namespaces in parallel
    console.log("Searching Pinecone namespaces...");
    const [schemeResults, serviceResults] = await Promise.all([
      index.namespace("schemes").query({
        vector: embedding,
        topK: 3,
        includeMetadata: true
      }),
      index.namespace("services").query({
        vector: embedding,
        topK: 3,
        includeMetadata: true
      })
    ]);

    console.log(`Found ${schemeResults.matches?.length || 0} schemes, ${serviceResults.matches?.length || 0} services.`);

    // Combine and format matches
    const allMatches = [
      ...(schemeResults.matches || []),
      ...(serviceResults.matches || [])
    ];

    // Sort by score if needed, but for now just returning all top matches
    return allMatches;
  } catch (error) {
    console.error("Pinecone Search Error:", error);
    return [];
  }
}

// 🔹 Generate final answer using RAG
async function generateRAGResponse(userQuestion, history = [], userId = null) {
  const matches = await searchPinecone(userQuestion);
  let userContext = "";

  if (userId) {
    try {
      // Fetch user's scheme applications and complaints
      const [applications, complaints] = await Promise.all([
        SchemeApplication.find({ citizen_id: userId }).populate("scheme_id", "name"),
        Complaints.find({ citizen_id: userId })
      ]);

      if (applications.length > 0) {
        userContext += "User's Scheme Applications:\n" + applications.map(app => 
          `- ${app.scheme_id?.name || 'Unknown Scheme'} (App No: ${app.application_no}, Status: ${app.status}, Remarks: ${app.remarks || 'None'})`
        ).join("\n") + "\n\n";
      }

      if (complaints.length > 0) {
        userContext += "User's Complaints:\n" + complaints.map(c => 
          `- ${c.title} (Complaint No: ${c.complaint_no}, Status: ${c.status}, Category: ${c.category}, Priority: ${c.priority})`
        ).join("\n") + "\n\n";
      }
    } catch (dbError) {
      console.error("Error fetching user context for chatbot:", dbError);
    }
  }

  if ((!matches || matches.length === 0) && !userContext) {
    return "I'm sorry, I couldn't find any relevant information in our database regarding your query. Please contact the department directly.";
  }

  console.log(`Processing ${matches.length} matches...`);
  
  const ragContext = matches
    .map(m => `[${m.metadata?.type || 'Info'}]: ${m.metadata?.text}`)
    .join("\n\n");

  const fullContext = userContext ? `PERSONALISED USER DATA:\n${userContext}\nGENERAL DATABASE INFO:\n${ragContext}` : ragContext;

  const model = genAI.getGenerativeModel({
    model: "gemini-3-flash-preview"
  });

  // Start chat with history
  const chat = model.startChat({
    history: history.map(h => ({
      role: h.role === "user" ? "user" : "model",
      parts: [{ text: h.content }]
    })),
  });

  const prompt = `
You are the "Purplelane" AI Assistant for the Andhra Pradesh Government.
Your goal is to help citizens with Government Schemes and Services.

Strictly answer based on the provided context below.
Check the "PERSONALISED USER DATA" first if the user asks about their own applications, status, or complaints.
If the answer is not in the context, say "I don't have information on that topic."

Context:
${fullContext}

User Question:
${userQuestion}

Answer (in helpful, friendly tone):
`;

  try {
    const result = await chat.sendMessage(prompt);

    // Check if response is blocked or empty
    if (!result || !result.response) {
      throw new Error("Gemini Error: No response received");
    }

    return result.response.text();
  } catch (err) {
    console.error("Gemini Generation Error:", err);
    throw err;
  }
}

// 🔹 Translate using Gemini (More reliable)
async function translateWithGemini(text, targetLang) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });
    const prompt = `Translate the following text to ${targetLang}. Return ONLY the translated text.
    
    Text: ${text}`;

    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    console.error("Gemini Translation Error:", error);
    throw error;
  }
}

// 🔹 Translate using Sarvam (Legacy/Fallback)
async function translateWithSarvam(text, targetLang, sourceLang = "en-IN") {
  try {
    const response = await axios.post(
      "https://api.sarvam.ai/translate/v1",
      {
        inputs: [text],
        source_language: sourceLang,
        target_language: targetLang === "en" ? "en-IN" : (targetLang === "te" ? "te-IN" : targetLang),
        model: "translation:v1"
      },
      {
        headers: {
          "api-subscription-key": process.env.SARVAM_API_KEY,
          "Content-Type": "application/json"
        }
      }
    );
    return response.data.translated_texts[0];
  } catch (error) {
    console.error("Sarvam Translation Error Details:", error.response?.data || error.message);
    throw error;
  }
}

// 🔹 Speech to Text using Gemini 1.5 Flash (Whisper Alternative)
async function speechToText(audioBuffer, mimetype = "audio/wav") {
  console.log(`[STT] Processing audio... Size: ${audioBuffer?.length} bytes, Mimetype: ${mimetype}`);

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

    // Normalize MimeType for Gemini
    let normalizedMimeType = mimetype.split(";")[0].trim();
    if (normalizedMimeType === "audio/blob" || !normalizedMimeType.includes("/")) {
      normalizedMimeType = "audio/webm"; // Default fallback for browser blobs
    }

    console.log(`[STT] Normalized MimeType: ${normalizedMimeType}`);

    const result = await model.generateContent([
      {
        inlineData: {
          data: audioBuffer.toString("base64"),
          mimeType: normalizedMimeType,
        },
      },
      "Transcribe the audio exactly. Return ONLY the transcribed text."
    ]);

    const transcript = result.response.text().trim();
    if (transcript) {
      console.log("[STT] Gemini Success:", transcript);
      return transcript;
    }
    throw new Error("Gemini returned empty transcript");

  } catch (error) {
    console.warn("[STT] Gemini Failed, falling back to Sarvam:", error.message);

    if (process.env.SARVAM_API_KEY) {
      try {
        return await speechToTextSarvam(audioBuffer, mimetype);
      } catch (sarvamError) {
        console.error("[STT] Sarvam fallback also failed:", sarvamError.message);
        throw sarvamError;
      }
    }
    throw error;
  }
}

// 🔹 Legacy STT using Sarvam (Fallback)
async function speechToTextSarvam(audioBuffer, mimetype = "audio/wav") {
  if (!process.env.SARVAM_API_KEY) {
    throw new Error("SARVAM_API_KEY is missing in .env");
  }

  let extension = "wav";
  if (mimetype.includes("webm")) extension = "webm";
  else if (mimetype.includes("mp4")) extension = "mp4";
  else if (mimetype.includes("ogg")) extension = "ogg";

  const FormData = require("form-data");
  const form = new FormData();
  form.append("file", audioBuffer, {
    filename: `recording.${extension}`,
    contentType: mimetype
  });
  form.append("model", "saaras:v3");
  form.append("mode", "translate");

  const response = await axios.post(
    "https://api.sarvam.ai/speech-to-text-translate",
    form,
    {
      headers: {
        ...form.getHeaders(),
        "api-subscription-key": process.env.SARVAM_API_KEY
      }
    }
  );

  console.log("[STT] Sarvam Success status:", response.status);
  return response.data.transcript;
}

module.exports = {
  generateRAGResponse,
  translateWithGemini,
  translateWithSarvam,
  speechToText
};
