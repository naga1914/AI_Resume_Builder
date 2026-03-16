import { GoogleGenerativeAI } from "@google/generative-ai";

// Note: model IDs change over time. `gemini-flash-latest` is broadly supported on v1beta.
const GEMINI_DEFAULT_MODEL = "gemini-flash-latest";

function buildPromptFromMessages(messages = []) {
  const systemParts = [];
  const userParts = [];

  for (const m of messages) {
    if (!m) continue;
    if (m.role === "system") systemParts.push(m.content);
    else if (m.role === "user") userParts.push(m.content);
  }

  const system = systemParts.filter(Boolean).join("\n\n").trim();
  const user = userParts.filter(Boolean).join("\n\n").trim();

  if (system && user) return `${system}\n\n${user}`;
  return system || user || "";
}

function normalizeGeminiError(error) {
  // @google/generative-ai typically throws errors with message only.
  // Try to surface status/code when present.
  let status =
    error?.status ??
    error?.response?.status ??
    error?.cause?.status ??
    undefined;

  const code =
    error?.code ??
    error?.cause?.code ??
    undefined;

  const message = error?.message || "Gemini request failed";

  // Some SDK errors only include the HTTP status in the message string.
  if (!status && typeof message === "string") {
    if (/\[404\b/i.test(message) || /\b404\b/.test(message)) status = 404;
    else if (/\[429\b/i.test(message) || /\b429\b/.test(message)) status = 429;
  }

  const e = new Error(message);
  e.status = status;
  e.code = code;
  return e;
}

let aiClient;

if (!process.env.GEMINI_API_KEY && !process.env.GOOGLE_API_KEY) {
  console.warn("Gemini API key not found — using mock AI for local testing.");

  aiClient = {
    chat: {
      completions: {
        create: async ({ messages }) => {
          const userMessage =
            messages && messages.length
              ? messages[messages.length - 1].content
              : "";
          const content = `MOCK: Enhanced content based on input -> ${userMessage}`;
          return { choices: [{ message: { content } }] };
        },
      },
    },
  };
} else {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);

  aiClient = {
    chat: {
      completions: {
        create: async ({ model, messages, temperature }) => {
          try {
            const requestedModel = process.env.GEMINI_MODEL || model || GEMINI_DEFAULT_MODEL;
            const prompt = buildPromptFromMessages(messages);

            const generate = async (modelName) => {
              const geminiModel = genAI.getGenerativeModel({ model: modelName });
              return await geminiModel.generateContent({
                contents: [{ role: "user", parts: [{ text: prompt }] }],
                generationConfig:
                  typeof temperature === "number" ? { temperature } : undefined,
              });
            };

            let result;
            try {
              result = await generate(requestedModel);
            } catch (err) {
              const normalized = normalizeGeminiError(err);
              // Common fix: older hardcoded model IDs may not exist for v1beta.
              if (normalized?.status === 404 && requestedModel !== GEMINI_DEFAULT_MODEL) {
                result = await generate(GEMINI_DEFAULT_MODEL);
              } else {
                throw normalized;
              }
            }

            const text = result?.response?.text?.() ?? "";
            return { choices: [{ message: { content: text } }] };
          } catch (err) {
            throw normalizeGeminiError(err);
          }
        },
      },
    },
  };
}

export default aiClient;