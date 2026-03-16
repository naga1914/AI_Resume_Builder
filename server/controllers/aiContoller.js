// aiController.js
import Resume from "../models/resume.js";
import ai from "../DB/ai.js";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getAIErrorInfo(error) {
  // Supports OpenAI SDK + Gemini wrapper + generic Axios/fetch errors.
  const status =
    error?.status ??
    error?.response?.status ??
    error?.statusCode ??
    undefined;

  const data = error?.response?.data;
  const errObj = error?.error ?? data?.error ?? undefined;

  const message =
    errObj?.message ??
    data?.message ??
    error?.message ??
    "Request failed";

  const code = errObj?.code ?? data?.code ?? error?.code ?? undefined;
  const type = errObj?.type ?? data?.type ?? undefined;

  const requestId =
    error?.request_id ??
    error?.headers?.["x-request-id"] ??
    error?.response?.headers?.["x-request-id"] ??
    undefined;

  const retryAfter =
    error?.headers?.["retry-after"] ??
    error?.response?.headers?.["retry-after"] ??
    undefined;

  return { status, message, code, type, requestId, retryAfter };
}

async function createChatCompletionWithRetry(createFn, { maxAttempts = 3 } = {}) {
  let lastError;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await createFn();
    } catch (error) {
      lastError = error;
      const info = getAIErrorInfo(error);

      const retryableStatuses = new Set([429, 500, 502, 503, 504]);
      if (!retryableStatuses.has(info?.status)) break;

      if (attempt === maxAttempts) break;

      // Exponential backoff with small jitter.
      const base = 750 * Math.pow(2, attempt - 1);
      const jitter = Math.floor(Math.random() * 250);
      await sleep(base + jitter);
    }
  }

  throw lastError;
}

function stripMarkdownCodeFences(text) {
  if (typeof text !== "string") return text;
  const trimmed = text.trim();
  // ```json ... ``` or ``` ... ```
  if (trimmed.startsWith("```")) {
    return trimmed.replace(/^```[a-zA-Z0-9]*\s*/m, "").replace(/```$/m, "").trim();
  }
  return trimmed;
}

/* =========================================================
   PROFESSIONAL SUMMARY
========================================================= */
export const enhanceProfessionalSummary = async (req, res) => {
  try {
    const { userContent } = req.body;

    if (!userContent) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    console.log("AI Input (Professional Summary):", userContent);

    const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

    const response = await createChatCompletionWithRetry(() =>
      ai.chat.completions.create({
        model,
        messages: [
          {
            role: "system",
            content:
              "You are an expert resume writer. Enhance the professional summary in 1-2 compelling sentences. Highlight key skills, experience, and career objectives. Make it ATS-friendly. Return only plain text.",
          },
          { role: "user", content: userContent },
        ],
      })
    );

    console.log("AI Response:", response);

    const enhancedContent = response.choices[0].message.content;

    return res.status(200).json({ enhancedContent });
  } catch (error) {
    const info = getAIErrorInfo(error);
    console.error("AI ERROR (Professional Summary):", info, error?.response?.data || error?.message);

    const status = info.status || 500;
    const friendly =
      status === 429
        ? "AI rate limit/quota reached. If you’re on Gemini free tier, wait a bit and try again; also avoid repeated clicks. If it persists, check your Gemini project quota."
        : info.message || "AI generation failed";

    return res.status(status).json({
      message: friendly,
      error: info.message,
      code: info.code,
      type: info.type,
      requestId: info.requestId,
      retryAfter: info.retryAfter,
    });
  }
};

/* =========================================================
   JOB DESCRIPTION
========================================================= */
export const enhanceJobDescription = async (req, res) => {
  try {
    const { userContent } = req.body;

    if (!userContent) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    console.log("AI Input (Job Description):", userContent);

    const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

    const response = await createChatCompletionWithRetry(() =>
      ai.chat.completions.create({
        model,
        messages: [
          {
            role: "system",
            content:
              "You are an expert resume writer. Enhance the job description using action verbs and measurable achievements. Keep it 1-2 strong sentences. Make it ATS-friendly. Return only plain text.",
          },
          { role: "user", content: userContent },
        ],
      })
    );

    console.log("AI Response:", response);

    const enhancedContent = response.choices[0].message.content;

    return res.status(200).json({ enhancedContent });
  } catch (error) {
    const info = getAIErrorInfo(error);
    console.error("AI ERROR (Job Description):", info, error?.response?.data || error?.message);

    const status = info.status || 500;
    const friendly =
      status === 429
        ? "AI rate limit/quota reached. If you’re on Gemini free tier, wait a bit and try again; also avoid repeated clicks. If it persists, check your Gemini project quota."
        : info.message || "AI generation failed";

    return res.status(status).json({
      message: friendly,
      error: info.message,
      code: info.code,
      type: info.type,
      requestId: info.requestId,
      retryAfter: info.retryAfter,
    });
  }
};

/* =========================================================
   PROJECT DESCRIPTION
========================================================= */
export const enhanceProjectDescription = async (req, res) => {
  try {
    const { userContent } = req.body;

    if (!userContent) {
      return res.status(400).json({ message: "Project description content is required" });
    }

    console.log("AI Input (Project Description):", userContent);

    const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

    const response = await createChatCompletionWithRetry(() =>
      ai.chat.completions.create({
        model,
        messages: [
          {
            role: "system",
            content:
              "You are an expert resume writer. Enhance the project description to be achievement-driven, impact-focused, and ATS-optimized. Use strong action verbs and measurable results where possible. Keep it concise. Return only plain text.",
          },
          { role: "user", content: userContent },
        ],
        temperature: 0.7,
      })
    );

    console.log("AI Response:", response);

    const enhancedContent = response.choices[0].message.content;

    return res.status(200).json({ enhancedContent });
  } catch (error) {
    const info = getAIErrorInfo(error);
    console.error("AI ERROR (Project Description):", info, error?.response?.data || error?.message);

    const status = info.status || 500;
    const friendly =
      status === 429
        ? "AI rate limit/quota reached. If you’re on Gemini free tier, wait a bit and try again; also avoid repeated clicks. If it persists, check your Gemini project quota."
        : info.message || "AI generation failed";

    return res.status(status).json({
      message: friendly,
      error: info.message,
      code: info.code,
      type: info.type,
      requestId: info.requestId,
      retryAfter: info.retryAfter,
    });
  }
};

/* =========================================================
   RESUME UPLOAD & EXTRACTION
========================================================= */
export const uploadResume = async (req, res) => {
  try {
    const { resumeText, title } = req.body;
    const userId = req.user._id;

    if (!resumeText) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    console.log("AI Input (Resume Upload):", resumeText);

    const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

    const response = await createChatCompletionWithRetry(() =>
      ai.chat.completions.create({
        model,
        messages: [
          {
            role: "system",
            content:
              "You are an expert AI agent that extracts structured data from resumes.",
          },
          {
            role: "user",
            content: `Extract structured data from this resume:

${resumeText}

Return ONLY valid JSON in this exact format:

{
  professional_summary: "",
  experience: [
    {
      company: "",
      position: "",
      start_date: "",
      end_date: "",
      description: "",
      is_current: false
    }
  ],
  education: [
    {
      institution: "",
      degree: "",
      field: "",
      graduation_date: "",
      gpa: ""
    }
  ],
  project: [
    {
      name: "",
      type: "",
      description: ""
    }
  ],
  skills: [],
  template: "classic",
  accent_color: "#3B82F6",
  public: false
}`,
          },
        ],
      })
    );

    console.log("AI Response (Resume):", response);

    let parsedData;
    try {
      const raw = response.choices[0].message.content;
      parsedData = JSON.parse(stripMarkdownCodeFences(raw));
    } catch (err) {
      console.error("JSON parse error:", response.choices[0].message.content);
      return res.status(500).json({
        message: "Failed to parse AI output",
        error: err.message,
      });
    }

    const newResume = await Resume.create({
      user: userId,
      title,
      ...parsedData,
    });

    return res.status(200).json({ resumeId: newResume._id });
  } catch (error) {
    const info = getAIErrorInfo(error);
    console.error("AI ERROR (Resume Upload):", info, error?.response?.data || error?.message);

    const status = info.status || 500;
    const friendly =
      status === 429
        ? "AI rate limit/quota reached. If you’re on Gemini free tier, wait a bit and try again; also avoid repeated clicks. If it persists, check your Gemini project quota."
        : info.message || "Resume extraction failed";

    return res.status(status).json({
      message: friendly,
      error: info.message,
      code: info.code,
      type: info.type,
      requestId: info.requestId,
      retryAfter: info.retryAfter,
    });
  }
};

export default {
  enhanceProfessionalSummary,
  enhanceJobDescription,
  enhanceProjectDescription,
  uploadResume,
};