import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import {fileURLToPath} from 'url';
import path from 'path'; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


dotenv.config({ path: path.resolve(__dirname, '../.env') });

const sendEmail = async (userName, email, subject, link) => {
    // nodemailer config
    let config =  {
        service: 'gmail',
        port:465,
        secure: true,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    }

    const mailTransporter = nodemailer.createTransport(config)

    let details = {
        from: process.env.EMAIL,
        to:email,
        subject:subject,
        html:`
        <h4>Hi ${userName},</h4> 
        <p>You requested to reset your password.</p>
        <p>Please click the link below to reset your password.</p>
        <a href='${link}'>Reset Password</a>
        `
    }

    try {
        await mailTransporter.sendMail(details);
        mailTransporter.close()

    }catch(e) {
        console.log(e, "email not sent");
    }
}

export default sendEmail;