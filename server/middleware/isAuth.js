import jwt from 'jsonwebtoken';
import { User } from '../models/userModel.js';
import dotenv from 'dotenv';
dotenv.config();
export const isAuthenticated = (req, res, next) => {
    try{
        const authHeader = req.headers.authorization;
        if(!authHeader || !authHeader.startsWith('Bearer ')){
            return res.status(401).json({
                success: false,
                message: "Authorization header missing or malformed"
            });
        }

        const token = authHeader.split(' ')[1];
        let decoded;
        jwt.verify(token, process.env.SECRET_KEY, async(err, decoded)=>{
            if(err){
                if(err.name === 'TokenExpiredError'){
                    return res.status(401).json({
                        success: false,
                        message: "Token has expired"
                    });
                }
                return res.status(401).json({
                    success: false,
                    message: "Invalid or expired token"
                });
            }
            const {id}= decoded;
            const user = await User.findById(id);
            if(!user){
                return res.status(404).json({
                    success: false,
                    message: "User not found"
                });
            }
            req.userId = user._id;
            next();
        });
    }
    catch(error){
        return res.status(500).json({
            success: false, 
            message: error.message
        });
    } 
}  
