const nodemailer = require("nodemailer");
const asyncHandler = require("express-async-handler");
const sendMail = asyncHandler(async ({ email, html }) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_NAME,
            pass: process.env.EMAIL_APP_PASSWORD
        },
    });
    const info = await transporter.sendMail({
        from: 'cuahangdientu <no-relply@example.com>', // sender address
        to: email,
        subject: "Forgot password",
        html: html
    });
    return info;
});
module.exports = sendMail;