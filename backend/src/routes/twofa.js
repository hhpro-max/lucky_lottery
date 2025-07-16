const express = require('express');
const router = express.Router();
const db = require('../models');
const { generate2FA, verify2FA } = require('../utils/twofa');
const { verifyAccessToken } = require('../utils/jwt');

// Middleware to require auth
function requireAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: 'Unauthorized' });
  try {
    const token = auth.split(' ')[1];
    req.user = verifyAccessToken(token);
    next();
  } catch {
    return res.status(401).json({ message: 'Unauthorized' });
  }
}

// POST /2fa/setup (returns QR code and secret)
router.post('/2fa/setup', requireAuth, async (req, res) => {
  const user = await db.User.findByPk(req.user.id);
  if (!user) return res.status(401).json({ message: 'Unauthorized' });
  const { qr, base32 } = await generate2FA(user);
  res.json({ qr, secret: base32 });
});

// POST /2fa/enable (verify code and enable 2FA)
router.post('/2fa/enable', requireAuth, async (req, res) => {
  const user = await db.User.findByPk(req.user.id);
  if (!user) return res.status(401).json({ message: 'Unauthorized' });
  const { token } = req.body;
  if (!token) return res.status(400).json({ message: 'Token required' });
  const ok = await verify2FA(user, token);
  if (!ok) return res.status(400).json({ message: 'Invalid 2FA code' });
  await db.User.update({ twofa_enabled: true }, { where: { id: user.id } });
  res.json({ message: '2FA enabled' });
});

// POST /2fa/verify (verify code for login)
router.post('/2fa/verify', requireAuth, async (req, res) => {
  const user = await db.User.findByPk(req.user.id);
  if (!user || !user.twofa_enabled) return res.status(401).json({ message: 'Unauthorized' });
  const { token } = req.body;
  if (!token) return res.status(400).json({ message: 'Token required' });
  const ok = await verify2FA(user, token);
  if (!ok) return res.status(400).json({ message: 'Invalid 2FA code' });
  res.json({ message: '2FA verified' });
});

module.exports = router;
