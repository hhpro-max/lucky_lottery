const nodemailer = require('nodemailer');

// Configure your transporter here
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

module.exports = async function sendResetMail(to, token) {
  const link = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${token}`;
  await transporter.sendMail({
    from: process.env.SMTP_FROM || 'no-reply@lottery.com',
    to,
    subject: 'Password Reset Request',
    html: `<p>Reset your password by clicking <a href="${link}">here</a>. This link expires in 1 hour.</p>`
  });
};
