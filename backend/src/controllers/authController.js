const db = require('../models');
const { hashPassword, verifyPassword } = require('../utils/password');
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../utils/jwt');
const { Op } = require('sequelize');

const { sendVerificationEmail } = require('../utils/emailVerification');
const sendMail = require('../utils/sendMail');
exports.signup = async (req, res) => {
  try {
    const { email, password, name, dob, address, phone } = req.body;
    // Check if user already exists
    const existing = await db.User.findOne({ where: { email } });
    if (existing) {
      // Do not reveal if email is registered
      return res.status(409).json({ message: 'Signup failed' });
    }
    // Hash password
    const password_hash = await hashPassword(password);
    // Create user
    const user = await db.User.create({ email, password_hash });
    // Create profile
    await db.Profile.create({
      user_id: user.id,
      name,
      dob,
      address,
      phone,
    });
    // Send verification email
    await sendVerificationEmail(user, sendMail);
    // Audit log
    await db.AuditLog.create({
      user_id: user.id,
      action: 'signup',
      details: { email },
      ip_address: req.ip,
      timestamp: new Date(),
    });
    return res.status(201).json({ message: 'Signup successful. Please verify your email.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await db.User.findOne({ where: { email } });
    if (!user) {
      // Do not reveal if user exists
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    // User status check
    if (user.status !== 'active') {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    // Account lockout check
    if (user.lockout_until && user.lockout_until > new Date()) {
      return res.status(423).json({ message: 'Account locked. Try again later.' });
    }
    if (!user.email_verified) {
      // Do not reveal if email is registered or not
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const valid = await verifyPassword(password, user.password_hash);
    if (!valid) {
      // Increment failed attempts
      let updates = { failed_login_attempts: user.failed_login_attempts + 1 };
      // Lock account if too many attempts
      if (updates.failed_login_attempts >= 5) {
        updates.lockout_until = new Date(Date.now() + 15 * 60 * 1000); // 15 min lock
        updates.failed_login_attempts = 0;
      }
      await db.User.update(updates, { where: { id: user.id } });
      // Audit log failed login
      await db.AuditLog.create({
        user_id: user.id,
        action: 'login_failed',
        details: { email },
        ip_address: req.ip,
        timestamp: new Date(),
      });
      // Do not reveal if password or email is wrong
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    // Reset failed attempts on success
    await db.User.update({ failed_login_attempts: 0, lockout_until: null }, { where: { id: user.id } });
    // Enforce 2FA for admin
    if (user.roles.includes('admin') && user.twofa_enabled) {
      // Issue short-lived access token for 2FA verification only
      const payload = { id: user.id, email: user.email, roles: user.roles, twofa: true };
      const accessToken = signAccessToken(payload);
      return res.status(206).json({ message: '2FA required', accessToken });
    }
    // Audit log successful login
    await db.AuditLog.create({
      user_id: user.id,
      action: 'login',
      details: { email },
      ip_address: req.ip,
      timestamp: new Date(),
    });
    // Issue tokens
    const payload = { id: user.id, email: user.email, roles: user.roles };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);
    // Store refresh token in DB
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    await db.SecurityToken.create({
      user_id: user.id,
      token: refreshToken,
      type: 'refresh',
      expires_at: expiresAt,
    });
    return res.json({ accessToken, refreshToken });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ message: 'Invalid request' });
    }
    // Verify token signature
    let payload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch (err) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }
    // Check token in DB
    const tokenRecord = await db.SecurityToken.findOne({
      where: {
        user_id: payload.id,
        token: refreshToken,
        type: 'refresh',
        expires_at: { [db.Sequelize.Op.gt]: new Date() },
      },
    });
    if (!tokenRecord) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    // Issue new access token
    const accessToken = signAccessToken({ id: payload.id, email: payload.email, roles: payload.roles });
    return res.json({ accessToken });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ message: 'Invalid request' });
    }
    // Remove token from DB
    const tokenRecord = await db.SecurityToken.findOne({ where: { token: refreshToken, type: 'refresh' } });
    await db.SecurityToken.destroy({ where: { token: refreshToken, type: 'refresh' } });
    // Audit log
    if (tokenRecord) {
      await db.AuditLog.create({
        user_id: tokenRecord.user_id,
        action: 'logout',
        details: {},
        ip_address: req.ip,
        timestamp: new Date(),
      });
    }
    return res.json({ message: 'Logged out successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};