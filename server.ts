import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Lazy initialization of Gemini client
let genAIClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI {
  if (!genAIClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("WARNING: GEMINI_API_KEY is not defined. AI queries will return a fallback notification.");
    }
    genAIClient = new GoogleGenAI({
      apiKey: apiKey || "",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return genAIClient;
}

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "online",
    system: "VEXO AI Core Engine",
    version: "3.5 Quantum",
    timestamp: new Date().toISOString(),
  });
});

// System diagnostics
app.get("/api/system-status", (req, res) => {
  res.json({
    name: "VEXO AI",
    fullTitle: "VEXO Neural Intelligence Chatbot",
    status: "OPERATIONAL",
    theme: "Black & Neon Emerald Matrix",
    latency: "12ms",
    capabilities: [
      "Omniscient General Question Answering",
      "Full Code Synthesis & Debugging",
      "Roman Urdu & Multilingual Fluent",
      "Mathematical Reasoning & Science Analysis",
      "Real-time Chat Sessions"
    ]
  });
});

// Primary Chat Route
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history = [], mode = "general" } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message is required" });
    }

    const ai = getGenAI();

    // VEXO AI System Directives
    const systemInstruction = `You are VEXO AI, a cutting-edge, ultra-intelligent, and high-performance conversational AI chatbot. Your identity is defined by speed, razor-sharp accuracy, and a sleek Black & Neon Green cyber aesthetic.

Core Directives:
1. Omniscient Q&A Capability (MANDATORY):
   - You MUST answer EVERY question the user asks directly, thoroughly, and intelligently.
   - Never say you cannot answer unless it violates fundamental safety. For all academic, scientific, coding, mathematical, daily-life, health, business, historical, tech, philosophical, or creative questions, deliver master-class answers.
   - When code is requested, provide clean, commented, modern code with explanations.
   - When step-by-step solutions are needed (e.g. math, troubleshooting), break them down logically.

2. Multilingual Excellence (Roman Urdu, Urdu, English, and more):
   - The user may ask questions in Roman Urdu (e.g., "muja AI k baray me btao", "yeh code error solve kro", "kya haal hai", "tum kon ho", "yeh sawal ka answer do").
   - When the user writes in Roman Urdu or Urdu, reply naturally and fluently in Roman Urdu (or Urdu script if they use it), maintaining your confident, friendly, and ultra-smart VEXO AI personality!
   - Example Roman Urdu tone: "Bilkul! Main VEXO AI hoon, aur main aap k is sawal ka mukammal aur behtareen jawab deta hoon..."
   - If the user writes in English, reply in crisp, articulate, high-clarity English.

3. Formatting & Presentation:
   - Use clean Markdown with headers (##, ###), bullet points, and code blocks with language tags (e.g. \`\`\`python, \`\`\`javascript).
   - Keep answers easy to read, scannable, and informative.`;

    // Map conversation history
    const contents: any[] = [];

    if (Array.isArray(history) && history.length > 0) {
      for (const item of history.slice(-10)) {
        if (item.text && (item.role === "user" || item.role === "model")) {
          contents.push({
            role: item.role === "user" ? "user" : "model",
            parts: [{ text: item.text }],
          });
        }
      }
    }

    // Add current user prompt
    contents.push({
      role: "user",
      parts: [{ text: message }],
    });

    // Model fallback cascade to handle temporary high demand (503) or rate limits
    const candidateModels = [
      "gemini-flash-latest",
      "gemini-3.1-flash-lite",
      "gemini-3.8-flash",
      "gemini-3.1-pro-preview"
    ];

    let replyText = "";
    let lastError: any = null;

    for (const candidateModel of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model: candidateModel,
          contents,
          config: {
            systemInstruction,
            temperature: 0.7,
          },
        });

        if (response.text) {
          replyText = response.text;
          break; // Succeeded!
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`Model ${candidateModel} failed with: ${err.message || err}. Attempting fallback model...`);
      }
    }

    if (!replyText) {
      if (lastError) {
        console.error("All candidate models failed:", lastError);
      }
      replyText = "VEXO AI neural network is currently experiencing extremely heavy traffic across all clusters. Please ask your question again in a few moments.";
    }

    return res.json({
      reply: replyText,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("VEXO AI Chat Error:", error);
    return res.status(200).json({
      reply: "VEXO AI core experienced a temporary delay due to high network demand. Please re-send your query.",
      timestamp: new Date().toISOString(),
      error: error.message,
    });
  }
});

async function startServer() {
  // Mount Vite middleware for dev or serve static files for prod
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[VEXO AI Online] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
