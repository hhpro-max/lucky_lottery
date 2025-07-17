/**
 * @swagger
 * tags:
 *   name: PasswordReset
 *   description: Password reset endpoints
 */

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Request a password reset email
 *     tags: [PasswordReset]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: If your email exists, a reset link has been sent
 */
const express = require('express');
const router = express.Router();
const { requestPasswordReset, resetPassword } = require('../utils/passwordReset');
const sendResetMail = require('../utils/sendResetMail');

// POST /auth/forgot-password
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email required' });
  const ok = await requestPasswordReset(email, sendResetMail);
  // Always return success to avoid email enumeration
  return res.json({ message: 'If your email exists, a reset link has been sent.' });
});

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Reset password using token
 *     tags: [PasswordReset]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successful
 *       400:
 *         description: Invalid or expired token
 */
// POST /auth/reset-password
router.post('/reset-password', async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password) return res.status(400).json({ message: 'Token and new password required' });
  const ok = await resetPassword(token, password);
  if (!ok) return res.status(400).json({ message: 'Invalid or expired token' });
  res.json({ message: 'Password reset successful' });
});

module.exports = router;
