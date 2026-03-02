import {registerUser, verification, loginUser, logoutUser,forgotPassword,verfiyOtp ,changePassword, getUserById, getUserResumes} from '../controllers/userController.js';
import express from 'express';
import protect from '../middleware/authMiddleware.js';

const userRoutes = express.Router();

// Async handler wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((err) => {
    console.error("Route error:", err);
    next(err);
  });
};

userRoutes.post('/register', asyncHandler(registerUser));
userRoutes.post('/verify', asyncHandler(verification));
userRoutes.post('/login', asyncHandler(loginUser));
userRoutes.post('/logout', asyncHandler(logoutUser));
userRoutes.post('/forgot-password', asyncHandler(forgotPassword));
userRoutes.post('/otp-verify/:email', asyncHandler(verfiyOtp));
userRoutes.post('/change-password/:email', asyncHandler(changePassword));
userRoutes.get('/data', protect, asyncHandler(getUserById));
userRoutes.post('/resumes', protect, asyncHandler(getUserResumes));


export default userRoutes;
