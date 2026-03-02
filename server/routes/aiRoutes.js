import express from "express";
import protect from "../middleware/authMiddleware.js";
import { enhanceJobDescription, enhanceProfessionalSummary, uploadResume,enhanceProjectDescription} from "../controllers/aiContoller.js";


const aiRouter=express.Router();

// Protected endpoint used by the app
aiRouter.post('/enhance-pro-sum',enhanceProfessionalSummary)
// Unprotected test endpoint for local development (calls same controller)
aiRouter.post('/enhance-pro-sum-test', enhanceProfessionalSummary)
aiRouter.post('/enhance-project-desc', protect, enhanceProjectDescription);
aiRouter.post('/enhance-job-desc',protect, enhanceJobDescription)
aiRouter.post('/upload-resume',protect,uploadResume)

export default aiRouter;