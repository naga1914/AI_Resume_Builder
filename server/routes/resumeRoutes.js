import express from "express";
import {
  createResume,
  getResumeById,
  updateResume,
  deleteResume,
  getPublicResumeById,
  getAllResumes,
} from "../controllers/resumeController.js";

import protect from "../middleware/authMiddleware.js";
import upload from "../DB/multer.js";

const resumeRoutes = express.Router();

resumeRoutes.get("/", protect, getAllResumes);
resumeRoutes.post("/create", protect, createResume);
// Support REST-style routes used by the client
resumeRoutes.put("/:resumeId", protect, updateResume);
resumeRoutes.delete("/:resumeId", protect, deleteResume);

// Keep existing image upload endpoint (works with multipart/form-data)
resumeRoutes.put("/update", upload.single("image"), protect, updateResume);

// Legacy/get-by-id routes
resumeRoutes.get("/get/:resumeId", protect, getResumeById);

// Public resume (keep before param route if needed)
resumeRoutes.get("/public/:resumeId", getPublicResumeById);

// Also support REST GET by id
resumeRoutes.get("/:resumeId", protect, getResumeById);

export default resumeRoutes;