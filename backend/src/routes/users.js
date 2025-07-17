const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middlewares/auth');
const validate = require('../middlewares/validate');

/**
 * @swagger
 * components:
 *   schemas:
 *     Profile:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: "John Doe"
 *         dob:
 *           type: string
 *           format: date
 *           example: "1990-01-15"
 *         address:
 *           type: string
 *           example: "123 Main St, City, Country"
 *         phone:
 *           type: string
 *           example: "+1234567890"
 *         KYC_status:
 *           type: string
 *           enum: [pending, approved, rejected]
 *           example: "pending"
 *         user:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *               example: 1
 *             email:
 *               type: string
 *               example: "user@example.com"
 *             email_verified:
 *               type: boolean
 *               example: true
 *             status:
 *               type: string
 *               enum: [active, locked, deleted]
 *               example: "active"
 *             created_at:
 *               type: string
 *               format: date-time
 *               example: "2024-01-15T10:30:00.000Z"
 *     ProfileUpdateRequest:
 *       type: object
 *       required:
 *         - name
 *         - dob
 *       properties:
 *         name:
 *           type: string
 *           example: "John Doe"
 *           description: Full name of the user
 *         dob:
 *           type: string
 *           format: date
 *           example: "1990-01-15"
 *           description: Date of birth (YYYY-MM-DD)
 *         address:
 *           type: string
 *           example: "123 Main St, City, Country"
 *           description: User's address
 *         phone:
 *           type: string
 *           example: "+1234567890"
 *           description: Phone number
 *     EmailVerificationRequest:
 *       type: object
 *       required:
 *         - token
 *       properties:
 *         token:
 *           type: string
 *           example: "abc123def456"
 *           description: Email verification token
 *     ForgotPasswordRequest:
 *       type: object
 *       required:
 *         - email
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: "user@example.com"
 *           description: User's email address
 *     ResetPasswordRequest:
 *       type: object
 *       required:
 *         - token
 *         - new_password
 *       properties:
 *         token:
 *           type: string
 *           example: "reset123token456"
 *           description: Password reset token
 *         new_password:
 *           type: string
 *           example: "newSecurePassword123"
 *           minLength: 8
 *           description: New password (minimum 8 characters)
 */

/**
 * @swagger
 * /users/me/profile:
 *   get:
 *     summary: Get current user's profile
 *     tags: [User Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Profile'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Profile not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/me/profile', auth, userController.getProfile);

/**
 * @swagger
 * /users/me/profile:
 *   patch:
 *     summary: Update current user's profile
 *     tags: [User Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProfileUpdateRequest'
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Profile updated successfully"
 *                 profile:
 *                   $ref: '#/components/schemas/Profile'
 *       400:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.patch('/me/profile', auth, validate, userController.updateProfile);

module.exports = router; 