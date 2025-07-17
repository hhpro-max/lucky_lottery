const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const authRouter = require('./routes/auth');
const adminRouter = require('./routes/admin');
const walletRouter = require('./routes/wallet');
const transactionsRouter = require('./routes/transactions');
const userRouter = require('./routes/users');
const affiliateRouter = require('./routes/affiliate');
const referralsRouter = require('./routes/referrals');
const notificationRouter = require('./routes/notifications');
const supportRouter = require('./routes/support');
const auditRouter = require('./routes/audit');
const settingsRouter = require('./routes/settings');
const announcementsRouter = require('./routes/announcements');
const { authLimiter, purchaseLimiter } = require('./middlewares/rateLimiter');
const emailVerificationRouter = require('./routes/emailVerification');
const passwordResetRouter = require('./routes/passwordReset');
const twofaRouter = require('./routes/twofa');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

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
app.use('/wallet', walletRouter);
app.use('/transactions', transactionsRouter);
app.use('/users', userRouter);
app.use('/affiliate', affiliateRouter);
app.use('/referrals', referralsRouter);
app.use('/notifications', notificationRouter);
app.use('/support', supportRouter);
app.use('/settings', settingsRouter);
app.use('/announcements', announcementsRouter);
app.use('/', auditRouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

module.exports = app; 