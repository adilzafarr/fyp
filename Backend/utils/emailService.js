const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendResetCode = async (to, code) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: 'Your Password Reset Code',
    text: `Use this code to reset your password: ${code}`,
  };
  await transporter.sendMail(mailOptions);
};

module.exports = { sendResetCode };
