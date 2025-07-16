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

module.exports = async function sendMail(to, token) {
  const link = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?token=${token}`;
  await transporter.sendMail({
    from: process.env.SMTP_FROM || 'no-reply@lottery.com',
    to,
    subject: 'Verify your email',
    html: `<p>Please verify your email by clicking <a href="${link}">here</a>.</p>`
  });
};
