const crypto = require('crypto');
const db = require('../models');
const { Op } = require('sequelize');

exports.sendVerificationEmail = async (user, sendMailFn) => {
  // Remove old tokens
  await db.EmailVerification.destroy({ where: { user_id: user.id } });
  // Generate token
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h
  await db.EmailVerification.create({
    user_id: user.id,
    token,
    expires_at: expiresAt,
  });
  // Send email (sendMailFn is a function to send email)
  await sendMailFn(user.email, token);
};

exports.verifyEmail = async (token) => {
  const record = await db.EmailVerification.findOne({
    where: {
      token,
      expires_at: { [Op.gt]: new Date() },
      verified_at: null,
    },
  });
  if (!record) return false;
  // Mark as verified
  record.verified_at = new Date();
  await record.save();
  // Update user
  await db.User.update({ email_verified: true }, { where: { id: record.user_id } });
  return true;
};
