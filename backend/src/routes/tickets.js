/**
 * @swagger
 * tags:
 *   name: Tickets
 *   description: Ticket purchase and user play endpoints
 */

const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const ticketController = require('../controllers/ticketController');

// All ticket routes require authentication
router.use(auth);

/**
 * @swagger
 * /tickets:
 *   post:
 *     summary: Purchase a ticket (deduct from wallet, validate numbers)
 *     tags: [Tickets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               lottery_draw_id:
 *                 type: integer
 *               numbers:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       201:
 *         description: Ticket purchased
 *       400:
 *         description: Invalid input or insufficient balance
 *       401:
 *         description: Unauthorized
 *   get:
 *     summary: Get user's tickets (optionally filter by draw)
 *     tags: [Tickets]
 *     parameters:
 *       - in: query
 *         name: draw
 *         schema:
 *           type: integer
 *         required: false
 *         description: Filter by draw ID
 *     responses:
 *       200:
 *         description: List of user's tickets
 *       401:
 *         description: Unauthorized
 */
router.post('/', ticketController.purchaseTicket);
router.get('/', ticketController.listTickets);

/**
 * @swagger
 * /tickets/{id}:
 *   get:
 *     summary: Get ticket detail and status
 *     tags: [Tickets]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Ticket ID
 *     responses:
 *       200:
 *         description: Ticket detail
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Ticket not found
 */
router.get('/:id', ticketController.getTicketDetail);

/**
 * @swagger
 * /draws/{drawId}/result:
 *   get:
 *     summary: Get draw result (winning numbers, prize tiers, jackpot)
 *     tags: [Tickets]
 *     parameters:
 *       - in: path
 *         name: drawId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Draw ID
 *     responses:
 *       200:
 *         description: Draw result
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Draw result not found
 */
router.get('/../draws/:drawId/result', ticketController.getDrawResult);

module.exports = router; 