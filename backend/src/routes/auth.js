const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const validate = require('../middlewares/validate');
const { signupSchema, loginSchema } = require('../validators/authValidator');

// POST /auth/signup
router.post('/signup', validate(signupSchema), authController.signup);

// POST /auth/login
router.post('/login', validate(loginSchema), authController.login);

// POST /auth/refresh
router.post('/refresh', authController.refresh);

// POST /auth/logout
router.post('/logout', authController.logout);

module.exports = router; 