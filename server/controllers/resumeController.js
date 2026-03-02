import imageKit from "../DB/imageKit.js";
import Resume from "../models/resume.js";
import fs from "fs";


// =============================
// ✅ CREATE RESUME (FULL SAVE)
// =============================
export const createResume = async (req, res) => {
  try {
    const userId = req.userId;

    const {
      title,
      personal_info,
      professional_summary,
      experience,
      education,
      project,
      skills,
      template,
      accent_color,
      public: isPublic,
    } = req.body;

    const newResume = await Resume.create({
      user: userId,
      title: title || "Untitled Resume",
      personal_info: personal_info || {},
      professional_summary: professional_summary || "",
      experience: experience || [],
      education: education || [],
      project: project || [],
      skills: skills || [],
      template: template || "classic",
      accent_color: accent_color || "#3B82F6",
      public: isPublic || false,
    });

    res.status(201).json({
      message: "Resume Created Successfully",
      resume: newResume,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// =============================
// ✅ GET ALL RESUMES
// =============================
export const getAllResumes = async (req, res) => {
  try {
    const userId = req.userId;

    const resumes = await Resume.find({ user: userId }).sort({
      updatedAt: -1,
    });

    res.status(200).json({ resumes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// =============================
// ✅ GET ONE RESUME
// =============================
export const getResumeById = async (req, res) => {
  try {
    const userId = req.userId;
    const { resumeId } = req.params;

    const resume = await Resume.findOne({
      _id: resumeId,
      user: userId,
    });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    res.status(200).json({ resume });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// =============================
// ✅ UPDATE RESUME (SECURE)
// =============================
export const updateResume = async (req, res) => {
  try {
    const userId = req.userId;
    const image = req.file;

    

    const resumeId = req.body.resumeId || req.params.resumeId;

    if (!resumeId) {
      return res.status(400).json({ message: "resumeId is required" });
    }

    // Parse resumeData if stringified
    let resumeDataCopy = {};

    if (req.body.resumeData) {
      try {
        resumeDataCopy = JSON.parse(req.body.resumeData);
      } catch (err) {
        return res.status(400).json({ message: "Invalid resumeData JSON" });
      }
    } else {
      resumeDataCopy = { ...req.body };
      delete resumeDataCopy.resumeId;
      delete resumeDataCopy.removeBackground;
    }

    const existingResume = await Resume.findOne({
      _id: resumeId,
      user: userId,
    });

    if (!existingResume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    // =============================
    // IMAGE UPLOAD
    // =============================
    if (image) {
      const imageBuffer = fs.createReadStream(image.path);

      const response = await imageKit.upload({
        file: imageBuffer,
        fileName: "resume-" + Date.now() + ".jpg",
        folder: "/user-resumes/",
        isPrivateFile: false,
        customMetadata: {
          removeBackground: req.body.removeBackground ? "true" : "false",
        },
      });

      if (!resumeDataCopy.personal_info) {
        resumeDataCopy.personal_info = {};
      }

      resumeDataCopy.personal_info.image = response.url;

      // Delete local file
      fs.unlinkSync(image.path);
    }

    const updatedResume = await Resume.findOneAndUpdate(
      { _id: resumeId, user: userId },
      resumeDataCopy,
      { new: true }
    );

    res.status(200).json({
      message: "Saved successfully",
      resume: updatedResume,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// =============================
// ✅ DELETE RESUME
// =============================
export const deleteResume = async (req, res) => {
  try {
    const userId = req.userId;
    const { resumeId } = req.params;

    const deleted = await Resume.findOneAndDelete({
      _id: resumeId,
      user: userId,
    });

    if (!deleted) {
      return res.status(404).json({ message: "Resume not found" });
    }

    res.status(200).json({ message: "Resume deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// =============================
// ✅ PUBLIC RESUME VIEW
// =============================
export const getPublicResumeById = async (req, res) => {
  try {
    const { resumeId } = req.params;

    const resume = await Resume.findOne({
      _id: resumeId,
      public: true,
    });

    if (!resume) {
      return res.status(404).json({ message: "Resume not public" });
    }

    res.status(200).json({ resume });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export default {
  createResume,
  getResumeById,
  updateResume,
  deleteResume,
  getPublicResumeById,
  getAllResumes,
};