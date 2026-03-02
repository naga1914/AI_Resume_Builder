import Resume from "../models/resume.js";
import ai from "../DB/ai.js";

/* =========================================================
   PROFESSIONAL SUMMARY
========================================================= */

export const enhanceProfessionalSummary = async (req, res) => {
  try {
    const { userContent } = req.body;

    if (!userContent) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const response = await ai.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      messages: [
        {
          role: "system",
          content:
            "You are an expert resume writer. Enhance the professional summary in 1-2 compelling sentences. Highlight key skills, experience, and career objectives. Make it ATS-friendly. Return only plain text.",
        },
        {
          role: "user",
          content: userContent,
        },
      ],
    });

    const enhancedContent = response.choices[0].message.content;

    return res.status(200).json({ enhancedContent });
  } catch (error) {
    console.error("AI ERROR:", error);
    return res.status(500).json({
      message: "AI generation failed",
      error: error.message,
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

    const response = await ai.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      messages: [
        {
          role: "system",
          content:
            "You are an expert resume writer. Enhance the job description using action verbs and measurable achievements. Keep it 1-2 strong sentences. Make it ATS-friendly. Return only plain text.",
        },
        {
          role: "user",
          content: userContent,
        },
      ],
    });

    const enhancedContent = response.choices[0].message.content;

    return res.status(200).json({ enhancedContent });
  } catch (error) {
    console.error("AI ERROR:", error);
    return res.status(500).json({
      message: "AI generation failed",
      error: error.message,
    });
  }
};

/* =========================================================
   PROJECT DESCRIPTION  ✅ (NEW CLEAN VERSION)
========================================================= */

export const enhanceProjectDescription = async (req, res) => {
  try {
    const { userContent } = req.body;

    if (!userContent) {
      return res
        .status(400)
        .json({ message: "Project description content is required" });
    }

    const response = await ai.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      messages: [
        {
          role: "system",
          content:
            "You are an expert resume writer. Enhance the project description to be achievement-driven, impact-focused, and ATS-optimized. Use strong action verbs and measurable results where possible. Keep it concise. Return only plain text.",
        },
        {
          role: "user",
          content: userContent,
        },
      ],
      temperature: 0.7,
    });

    const enhancedContent = response.choices[0].message.content;

    return res.status(200).json({ enhancedContent });
  } catch (error) {
    console.error("AI ERROR:", error);
    return res.status(500).json({
      message: "AI generation failed",
      error: error.message,
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

    const response = await ai.chat.completions.create({
      model: process.env.OPENAI_MODEL,
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
      response_format: { type: "json_object" },
    });

    const parsedData = JSON.parse(response.choices[0].message.content);

    const newResume = await Resume.create({
      user: userId,
      title,
      ...parsedData,
    });

    return res.json({ resumeId: newResume._id });
  } catch (error) {
    console.error("AI ERROR:", error);
    return res.status(500).json({
      message: "Resume extraction failed",
      error: error.message,
    });
  }
};

export default {enhanceJobDescription, enhanceProfessionalSummary, uploadResume,enhanceProjectDescription};