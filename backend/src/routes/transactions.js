const express = require('express');
const router = express.Router();
const walletController = require('../controllers/walletController');
const auth = require('../middlewares/auth');

/**
 * @swagger
 * /transactions/{id}:
 *   get:
 *     summary: Get specific transaction details
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Transaction ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Transaction details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Transaction'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Transaction not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:id', auth, walletController.getTransaction);

module.exports = router; 