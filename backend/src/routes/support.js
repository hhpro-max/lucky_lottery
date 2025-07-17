const express = require('express');
const router = express.Router();
const supportController = require('../controllers/supportController');
const auth = require('../middlewares/auth');
const validate = require('../middlewares/validate');

/**
 * @swagger
 * components:
 *   schemas:
 *     SupportTicket:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         user_id:
 *           type: integer
 *           example: 1
 *         subject:
 *           type: string
 *           example: "Payment issue"
 *         message:
 *           type: string
 *           example: "I'm having trouble with my deposit"
 *         status:
 *           type: string
 *           enum: [open, closed, pending]
 *           example: "open"
 *         created_at:
 *           type: string
 *           format: date-time
 *           example: "2024-01-15T10:30:00.000Z"
 *         closed_at:
 *           type: string
 *           format: date-time
 *           example: "2024-01-16T15:45:00.000Z"
 *         user:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *               example: 1
 *             email:
 *               type: string
 *               example: "user@example.com"
 *     CreateTicketRequest:
 *       type: object
 *       required:
 *         - subject
 *         - message
 *       properties:
 *         subject:
 *           type: string
 *           example: "Payment issue"
 *           maxLength: 255
 *           description: Ticket subject
 *         message:
 *           type: string
 *           example: "I'm having trouble with my deposit"
 *           description: Detailed description of the issue
 *     UpdateTicketRequest:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           enum: [open, closed, pending]
 *           example: "closed"
 *           description: New status for the ticket
 *         admin_reply:
 *           type: string
 *           example: "We have resolved your issue"
 *           description: Admin's reply to the ticket
 *     TicketListResponse:
 *       type: object
 *       properties:
 *         tickets:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/SupportTicket'
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
 *     TicketStats:
 *       type: object
 *       properties:
 *         total_tickets:
 *           type: integer
 *           example: 150
 *         open_tickets:
 *           type: integer
 *           example: 25
 *         pending_tickets:
 *           type: integer
 *           example: 10
 *         closed_tickets:
 *           type: integer
 *           example: 115
 *         recent_tickets:
 *           type: integer
 *           example: 8
 */

/**
 * @swagger
 * /support/tickets:
 *   post:
 *     summary: Create a new support ticket
 *     tags: [Support]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTicketRequest'
 *     responses:
 *       201:
 *         description: Support ticket created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Support ticket created successfully"
 *                 ticket:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     subject:
 *                       type: string
 *                       example: "Payment issue"
 *                     message:
 *                       type: string
 *                       example: "I'm having trouble with my deposit"
 *                     status:
 *                       type: string
 *                       example: "open"
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-01-15T10:30:00.000Z"
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
router.post('/tickets', auth, validate, supportController.createTicket);

/**
 * @swagger
 * /support/tickets:
 *   get:
 *     summary: Get user's support tickets
 *     tags: [Support]
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
 *         description: Number of tickets per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [open, closed, pending]
 *         description: Filter by ticket status
 *     responses:
 *       200:
 *         description: Support tickets retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TicketListResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/tickets', auth, supportController.getTickets);

/**
 * @swagger
 * /support/tickets/{id}:
 *   get:
 *     summary: Get specific support ticket details
 *     tags: [Support]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Support ticket ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Support ticket details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SupportTicket'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Support ticket not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/tickets/:id', auth, supportController.getTicket);

module.exports = router; 