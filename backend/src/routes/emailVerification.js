const express = require('express');
const router = express.Router();
const db = require('../models');
const { verifyEmail } = require('../utils/emailVerification');

// GET /auth/verify-email?token=...
router.get('/verify-email', async (req, res) => {
  const { token } = req.query;
  if (!token) return res.status(400).json({ message: 'Token required' });
  const ok = await verifyEmail(token);
  if (!ok) return res.status(400).json({ message: 'Invalid or expired token' });
  res.json({ message: 'Email verified successfully' });
});

module.exports = router;
