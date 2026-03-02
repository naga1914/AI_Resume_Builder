import { User } from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Session } from '../models/sessionModel.js';
import { mailVerify } from '../verfiyMail/mailVerfiy.js';
import dotenv from 'dotenv';
import { sendOtpMail } from '../verfiyMail/sendOtpMail.js';
dotenv.config();
import Resume from "../models/resume.js";


export const registerUser = async (req, res) => {
    try {
        console.log("=== REGISTER START ===");
        console.log("Request body:", JSON.stringify(req.body));
        
        const { username, email, password } = req.body;

        // Validation
        if (!username?.trim() || !email?.trim() || !password?.trim()) {
            console.log("Validation failed: missing fields");
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        console.log(`Checking if user ${email} exists`);
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            console.log("User already exists");
            return res.status(400).json({
                success: false,
                message: "Email already registered"
            });
        }

        console.log("Hashing password...");
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("Password hashed successfully");

        console.log("Creating user document...");
        const newUser = new User({
            username: username.trim(),
            email: email.toLowerCase().trim(),
            password: hashedPassword,
            isVerified: true // Auto-verify for now
        });

        console.log("Saving to database...");
        const savedUser = await newUser.save();
        console.log("✓ User saved:", savedUser._id);

        console.log("Creating JWT token...");
        const token = jwt.sign(
            { id: savedUser._id },
            process.env.SECRET_KEY || "fallback-secret-key",
            { expiresIn: '7d' }
        );
        console.log("✓ Token created");

        console.log("=== REGISTER SUCCESS ===");
        return res.status(201).json({
            success: true,
            message: "Registration successful!",
            token: token,
            user: {
                id: savedUser._id,
                username: savedUser.username,
                email: savedUser.email,
                isVerified: savedUser.isVerified
            }
        });

    } catch (error) {
        console.error("=== REGISTER ERROR ===");
        console.error("Name:", error.name);
        console.error("Message:", error.message);
        console.error("Stack:", error.stack);
        
        // Handle duplicate key error
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "Email already registered"
            });
        }
        
        return res.status(500).json({
            success: false,
            message: error.message || "Registration failed. Please try again."
        });
    }
};


export const verification = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;

        // Check token header
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: "Authorization header missing or malformed"
            });
        }

        const token = authHeader.split(' ')[1];

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.SECRET_KEY);
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({
                    success: false,
                    message: "Token has expired"
                });
            }

            return res.status(401).json({
                success: false,
                message: "Invalid token"
            });
        }

        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Already verified check
        if (user.isVerified) {
            return res.status(400).json({
                success: false,
                message: "User already verified"
            });
        }

        // Verify user
        user.isVerified = true;
        user.token = null;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Email verified successfully"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;   
        // Validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({   
                success: false,
                message: "Invalid email"
            });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({   
                success: false,
                message: "Invalid password"
            });
        }
        // Note: Email verification check removed - users can login immediately after registration
        
        // check if exiting session
        const existingSession = await Session.findOne({ email });
        if(existingSession){
            await Session.deleteOne({ email: email });
        }
        // Create session
        await Session.create({
            email: email,
            userId: user._id
        });
        // Generate JWT token
        const accessToken= jwt.sign(
            { id: user._id },
            process.env.SECRET_KEY,
            { expiresIn: '1h' }
        );
        user.isLoggedIn=true;
        await user.save();
        return res.status(200).json({
            success: true,
            message: "Login successful",
            token: accessToken,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                isVerified: user.isVerified
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const logoutUser = async (req, res) => {
    try {
        const userId = req.userId;
        await Session.deleteOne({ userId });
        await User.findByIdAndUpdate(userId, { LoginStatus: false });
        return res.status(200).json({
            success: true,
            message: "Logout successful"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export const forgotPassword = async (req, res) => {
    // Implementation for forgot password
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        const otp=Math.floor(100000 + Math.random() * 900000).toString();
        const expiry= new Date(Date.now() + 10*60*1000); // 10 minutes from now
        user.otp=otp;
        user.otpExpiry=expiry;
        await user.save();
        await sendOtpMail(email, otp);
        // Here you would send the OTP to the user's email
        // For simplicity, we are just returning it in the response
        return res.status(200).json({
            success: true,
            message: "OTP sent to email",
            otp
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const verfiyOtp = async (req, res) => {
    // Implementation for OTP verification
    const {otp}=req.body;
    const email=req.params.email;
    if(!otp){
        return res.status(400).json({
            success:false,
            message:"OTP is required"
        });
    }
    try{
        const user=await User.findOne({email});
        if(!user){
            return res.status(404).json({
                success:false,
                message:"User not found"
            });
        }if(!user.otp || !user.otpExpiry){
            return res.status(400).json({
                success:false,
                message:"No OTP request found"
            });
        }
        if(user.otp!==otp){
            return res.status(400).json({
                success:false,
                message:"Invalid OTP"
            });
        }
        user.otp=null;
        user.otpExpiry=null;
        await user.save();
        return res.status(200).json({
            success:true,
            message:"OTP verified successfully"
        });
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:error.message
        });
}
}

export const changePassword = async (req, res) => {
    // Implementation for changing password after OTP verification
    const { newPassword ,confirmPassword} = req.body;
    const email=req.params.email;
    if (!newPassword || !confirmPassword) {
        return res.status(400).json({
            success: false,
            message: "New password and confirm password are required"
        });
    }
    if (newPassword !== confirmPassword) {
        return res.status(400).json({
            success: false,
            message: "Passwords do not match"
        });
    }
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();
        return res.status(200).json({
            success: true,
            message: "Password changed successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
    
}

export const getUserById=async(req,res)=>{
    try{
        const userId=req.userId;

        const user=await User.findById(userId)
        if(!user){
            return res.status(404).json({message:'user not found'})
        }
        user.password=undefined;
        return res.status(200).json({user})
    }
    catch(error){
        return res.status(400).json({message: error.message})
    }
}
export const getUserResumes = async (req, res) => {
      try {
        const userId=req.userId;
        const resumes = await Resume.find({ userId })
      
        return res.status(200).json({resumes})
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
};
export default { registerUser, verification, loginUser, logoutUser,forgotPassword,verfiyOtp ,changePassword, getUserResumes,getUserById};