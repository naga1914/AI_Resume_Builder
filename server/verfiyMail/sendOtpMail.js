import nodemailers from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

export const sendOtpMail = async (email, otp) => {
    try {
        const transporter = nodemailers.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        }); 
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your OTP Code',
            text: `Your OTP code is: ${otp}`
        };
        await transporter.sendMail(mailOptions);
        console.log(`OTP email sent to ${email}`);
    } catch (error) {
        console.error(`Error sending OTP email to ${email}:`, error);
        throw new Error('Could not send OTP email');
    }
}