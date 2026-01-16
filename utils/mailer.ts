import nodemailer from 'nodemailer'
import SendMailParams from '@/interfaces/interfaces';
import { v4 as uuidv4 } from 'uuid';
import User from '@/models/userModel'
export const sendMail = async ({ email, emailType, userId }: SendMailParams) => {
    try {
        //generate a hashed token ,,, if the email type is verify we will update some fields in database
        const hashedToken = uuidv4();
        if (emailType === "VERIFY") {
            await User.findOneAndUpdate({
                verifyToken: hashedToken,
                verifyTokenExpiry: Date.now() + 3600000
            })
        } else if (emailType === "RESET") {
            await User.findOneAndUpdate({
                forgotPasswordToken: hashedToken,
                forgotPasswordTokenExpiry: Date.now() + 3600000
            })
        }

        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // Use true for port 465, false for port 587
            auth: {
                user: "dr.octopus.one@gmail.com",
                pass: "vdmkivtcfinjunxg",
            },
        });

        const mailOptions = {
            from: 'prashant047alg@gmail.com',
            to: email,
            subject: emailType === "VERIFY" ? "verify your email" : "reset your password",
            text: "Hello world?", // Plain-text version of the message
            html: `<p>Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">here</a> to ${emailType === "VERIFY" ? "verify your email" : "reset your password"}</p>`, // HTML version of the message
        }

        const mailResponse = await transporter.sendMail(mailOptions)
        return mailResponse
    } catch (err) {

    }

}
