const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const db = require('../models');

// Generate 2FA secret and QR code for user
exports.generate2FA = async (user) => {
  const secret = speakeasy.generateSecret({ name: `LotteryApp (${user.email})` });
  // Store secret temp in DB (or in-memory, or return to user for setup)
  await db.User.update({ twofa_secret: secret.base32 }, { where: { id: user.id } });
  const qr = await qrcode.toDataURL(secret.otpauth_url);
  return { otpauth_url: secret.otpauth_url, qr, base32: secret.base32 };
};

// Verify 2FA token
exports.verify2FA = async (user, token) => {
  if (!user.twofa_secret) return false;
  return speakeasy.totp.verify({
    secret: user.twofa_secret,
    encoding: 'base32',
    token,
    window: 1,
  });
};
