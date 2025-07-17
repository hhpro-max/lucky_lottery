const express = require('express');
const router = express.Router();
const affiliateController = require('../controllers/affiliateController');
const auth = require('../middlewares/auth');

/**
 * @swagger
 * /referrals:
 *   get:
 *     summary: Get list of referred users and their statuses
 *     tags: [Referrals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *         description: Number of referrals per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, locked, deleted]
 *         description: Filter by user status
 *     responses:
 *       200:
 *         description: Referrals list retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 referrals:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       referred_at:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-01-15T10:30:00.000Z"
 *                       user:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 2
 *                           email:
 *                             type: string
 *                             example: "referred@example.com"
 *                           status:
 *                             type: string
 *                             enum: [active, locked, deleted]
 *                             example: "active"
 *                           joined_at:
 *                             type: string
 *                             format: date-time
 *                             example: "2024-01-15T10:30:00.000Z"
 *                           profile:
 *                             type: object
 *                             properties:
 *                               name:
 *                                 type: string
 *                                 example: "Jane Doe"
 *                               KYC_status:
 *                                 type: string
 *                                 enum: [pending, approved, rejected]
 *                                 example: "approved"
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     current_page:
 *                       type: integer
 *                       example: 1
 *                     total_pages:
 *                       type: integer
 *                       example: 3
 *                     total_items:
 *                       type: integer
 *                       example: 45
 *                     items_per_page:
 *                       type: integer
 *                       example: 20
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
router.get('/', auth, affiliateController.getReferrals);

module.exports = router; 