const rateLimit = require('express-rate-limit');

// General auth rate limiter
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each IP to 20 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

// Stricter limiter for ticket purchase
const purchaseLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many purchase attempts, please try again later.'
});

module.exports = {
  authLimiter,
  purchaseLimiter,
}; 