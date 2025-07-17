const express = require('express');
const router = express.Router();
const db = require('../models');
const { verifyEmail } = require('../utils/emailVerification');

/**
 * @swagger
 * tags:
 *   name: EmailVerification
 *   description: Email verification endpoints
 */

/**
 * @swagger
 * /auth/verify-email:
 *   get:
 *     summary: Verify user email using token
 *     tags: [EmailVerification]
 *     parameters:
 *       - in: query
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *         description: Verification token
 *     responses:
 *       200:
 *         description: Email verified successfully
 *       400:
 *         description: Invalid or expired token
 */
router.get('/verify-email', async (req, res) => {
  const { token } = req.query;
  if (!token) return res.status(400).json({ message: 'Token required' });
  const ok = await verifyEmail(token);
  if (!ok) return res.status(400).json({ message: 'Invalid or expired token' });
  res.json({ message: 'Email verified successfully' });
});

module.exports = router;
