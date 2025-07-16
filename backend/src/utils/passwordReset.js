const crypto = require('crypto');
const db = require('../models');
const { Op } = require('sequelize');
const { hashPassword } = require('../utils/password');

// Request password reset: generate token and send email
exports.requestPasswordReset = async (email, sendMailFn, ipAddress = null) => {
  const user = await db.User.findOne({ where: { email } });
  if (!user) return false;
  // Remove old tokens
  await db.SecurityToken.destroy({ where: { user_id: user.id, type: 'reset_password' } });
  // Generate token
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
  await db.SecurityToken.create({
    user_id: user.id,
    token,
    type: 'reset_password',
    expires_at: expiresAt,
  });
  await sendMailFn(user.email, token);
  // Audit log
  await db.AuditLog.create({
    user_id: user.id,
    action: 'request_password_reset',
    details: { email },
    ip_address: ipAddress,
    timestamp: new Date(),
  });
  return true;
};

// Reset password using token
exports.resetPassword = async (token, newPassword, ipAddress = null) => {
  const record = await db.SecurityToken.findOne({
    where: {
      token,
      type: 'reset_password',
      expires_at: { [Op.gt]: new Date() },
    },
  });
  if (!record) return false;
  const password_hash = await hashPassword(newPassword);
  await db.User.update({ password_hash }, { where: { id: record.user_id } });
  // Invalidate all refresh tokens for this user
  await db.SecurityToken.destroy({ where: { user_id: record.user_id, type: 'refresh' } });
  await db.SecurityToken.destroy({ where: { id: record.id } });
  // Audit log
  await db.AuditLog.create({
    user_id: record.user_id,
    action: 'reset_password',
    details: {},
    ip_address: ipAddress,
    timestamp: new Date(),
  });
  return true;
};
