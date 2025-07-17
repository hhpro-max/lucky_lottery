/**
 * @swagger
 * tags:
 *   name: Payouts
 *   description: Payout listing and detail endpoints
 */

const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const payoutController = require('../controllers/payoutController');

// All payout routes require authentication
router.use(auth);

/**
 * @swagger
 * /payouts:
 *   get:
 *     summary: List payouts (optionally filter by user or draw)
 *     tags: [Payouts]
 *     parameters:
 *       - in: query
 *         name: user
 *         schema:
 *           type: integer
 *         required: false
 *         description: Filter by user ID (admin only)
 *       - in: query
 *         name: draw
 *         schema:
 *           type: integer
 *         required: false
 *         description: Filter by draw ID
 *     responses:
 *       200:
 *         description: List of payouts
 *       401:
 *         description: Unauthorized
 */
router.get('/', payoutController.listPayouts);

/**
 * @swagger
 * /payouts/{id}:
 *   get:
 *     summary: Get payout detail
 *     tags: [Payouts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Payout ID
 *     responses:
 *       200:
 *         description: Payout detail
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Payout not found
 */
router.get('/:id', payoutController.getPayoutDetail);

module.exports = router; 