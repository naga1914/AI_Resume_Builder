import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import handlebars from 'handlebars';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

export const mailVerify = async (token, email) => {
  return new Promise((resolve, reject) => {
    try {
      const EmailTemplateSource = fs.readFileSync(path.join(__dirname, 'template.hbs'), 'utf8');
      const template = handlebars.compile(EmailTemplateSource);
      const htmlTOSend = template({ token: encodeURIComponent(token) });
      
      if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
        console.warn('Email credentials not configured. Skipping email verification.');
        return resolve();
      }
      
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS
        }
      });

      const mailConfiguration = {
        from: process.env.MAIL_USER,
        to: email,
        subject: "Verify your email address",
        html: htmlTOSend,
      };

      transporter.sendMail(mailConfiguration, function (error, info) {
        if (error) {
          console.log("Error sending email:", error);
          return reject(error);
        }
        console.log('Email sent successfully: ' + info.response);
        return resolve();
      });
    } catch (error) {
      reject(error);
    }
  });
};

export default mailVerify;
