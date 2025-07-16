const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const authRouter = require('./routes/auth');
const adminRouter = require('./routes/admin');
const { authLimiter, purchaseLimiter } = require('./middlewares/rateLimiter');
const emailVerificationRouter = require('./routes/emailVerification');
const passwordResetRouter = require('./routes/passwordReset');
const twofaRouter = require('./routes/twofa');

const app = express();

// Security HTTP headers
app.use(helmet());

// Enable CORS (customize as needed)
app.use(cors({
  origin: (origin, callback) => {
    if (process.env.NODE_ENV === 'production') {
      const allowed = (process.env.CORS_ORIGIN || '').split(',').map(o => o.trim());
      if (!origin || allowed.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    } else {
      callback(null, true); // Allow all in development
    }
  },
  credentials: true,
}));

// Rate limiting for /auth
app.use('/auth', authLimiter);

// TODO: Apply purchaseLimiter to /tickets/purchase route when implemented
// app.use('/tickets/purchase', purchaseLimiter);

// Parse JSON bodies
app.use(express.json());

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/auth', authRouter);
app.use('/auth', emailVerificationRouter);
app.use('/auth', passwordResetRouter);
app.use('/', twofaRouter);
app.use('/admin', adminRouter);

module.exports = app; 