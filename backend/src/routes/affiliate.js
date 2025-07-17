const express = require('express');
const router = express.Router();
const affiliateController = require('../controllers/affiliateController');
const auth = require('../middlewares/auth');
const validate = require('../middlewares/validate');

/**
 * @swagger
 * components:
 *   schemas:
 *     AffiliateStats:
 *       type: object
 *       properties:
 *         affiliate_code:
 *           type: string
 *           example: "ABC12345"
 *         total_referrals:
 *           type: integer
 *           example: 15
 *         recent_referrals:
 *           type: integer
 *           example: 3
 *         commission_earned:
 *           type: number
 *           format: float
 *           example: 125.50
 *         user:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *               example: 1
 *             email:
 *               type: string
 *               example: "affiliate@example.com"
 *     Referral:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         referred_at:
 *           type: string
 *           format: date-time
 *           example: "2024-01-15T10:30:00.000Z"
 *         user:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *               example: 2
 *             email:
 *               type: string
 *               example: "referred@example.com"
 *             status:
 *               type: string
 *               enum: [active, locked, deleted]
 *               example: "active"
 *             joined_at:
 *               type: string
 *               format: date-time
 *               example: "2024-01-15T10:30:00.000Z"
 *             profile:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   example: "Jane Doe"
 *                 KYC_status:
 *                   type: string
 *                   enum: [pending, approved, rejected]
 *                   example: "approved"
 *     CreateReferralRequest:
 *       type: object
 *       required:
 *         - referred_email
 *         - referred_name
 *       properties:
 *         referred_email:
 *           type: string
 *           format: email
 *           example: "referred@example.com"
 *           description: Email of the referred user
 *         referred_name:
 *           type: string
 *           example: "Jane Doe"
 *           description: Name of the referred user
 *     ReferralListResponse:
 *       type: object
 *       properties:
 *         referrals:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Referral'
 *         pagination:
 *           type: object
 *           properties:
 *             current_page:
 *               type: integer
 *               example: 1
 *             total_pages:
 *               type: integer
 *               example: 3
 *             total_items:
 *               type: integer
 *               example: 45
 *             items_per_page:
 *               type: integer
 *               example: 20
 */

/**
 * @swagger
 * /affiliate:
 *   get:
 *     summary: Get affiliate statistics and information
 *     tags: [Affiliate]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Affiliate stats retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AffiliateStats'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Affiliate account not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', auth, affiliateController.getAffiliateStats);

/**
 * @swagger
 * /affiliate/referrals:
 *   post:
 *     summary: Create a new referral (manual creation/correction)
 *     tags: [Affiliate]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateReferralRequest'
 *     responses:
 *       201:
 *         description: Referral created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Referral created successfully"
 *                 referral:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     referred_user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 2
 *                         email:
 *                           type: string
 *                           example: "referred@example.com"
 *                         name:
 *                           type: string
 *                           example: "Jane Doe"
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-01-15T10:30:00.000Z"
 *       400:
 *         description: Invalid input or self-referral attempt
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
 *       404:
 *         description: Affiliate account or referred user not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Referral already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/referrals', auth, validate, affiliateController.createReferral);

module.exports = router; 