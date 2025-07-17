const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const rbac = require('../middlewares/rbac');
const adminController = require('../controllers/adminController');

// All admin routes require authentication
router.use(auth);

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin management endpoints
 */

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: List all users
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: List of users
 *       401:
 *         description: Unauthorized
 */
router.get('/users', rbac('admin'), adminController.listUsers);

/**
 * @swagger
 * /admin/users/{id}/roles:
 *   patch:
 *     summary: Update user roles
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               roles:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Roles updated
 *       401:
 *         description: Unauthorized
 */
router.patch('/users/:id/roles', rbac('admin'), adminController.updateUserRoles);

/**
 * @swagger
 * /admin/users/{id}:
 *   delete:
 *     summary: Delete a user
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted
 *       401:
 *         description: Unauthorized
 */
router.delete('/users/:id', rbac('admin'), adminController.deleteUser);

// --- GameType Management ---
/**
 * @swagger
 * /admin/game-types:
 *   get:
 *     summary: List all game types
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: List of game types
 *       401:
 *         description: Unauthorized
 *   post:
 *     summary: Create a new game type
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               rules:
 *                 type: string
 *               active:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Game type created
 *       401:
 *         description: Unauthorized
 *       409:
 *         description: Game type already exists
 */
router.get('/game-types', rbac('admin'), adminController.listGameTypes);
router.post('/game-types', rbac('admin'), adminController.createGameType);

/**
 * @swagger
 * /admin/game-types/{id}:
 *   patch:
 *     summary: Update a game type
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Game type ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               rules:
 *                 type: string
 *               active:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Game type updated
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Game type not found
 *   delete:
 *     summary: Delete a game type
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Game type ID
 *     responses:
 *       200:
 *         description: Game type deleted
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Game type not found
 */
router.patch('/game-types/:id', rbac('admin'), adminController.updateGameType);
router.delete('/game-types/:id', rbac('admin'), adminController.deleteGameType);

// --- Draw Management ---
/**
 * @swagger
 * /admin/draws:
 *   get:
 *     summary: List draws (optionally filter by status)
 *     tags: [Admin]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [scheduled, completed, cancelled]
 *         required: false
 *         description: Filter draws by status
 *     responses:
 *       200:
 *         description: List of draws
 *       401:
 *         description: Unauthorized
 *   post:
 *     summary: Create and schedule a new draw
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               game_type_id:
 *                 type: integer
 *               draw_date:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Draw created
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Game type not found
 */
router.get('/draws', rbac('admin'), adminController.listDraws);
router.post('/draws', rbac('admin'), adminController.createDraw);

/**
 * @swagger
 * /admin/draws/{id}/close:
 *   patch:
 *     summary: Stop ticket sales for a draw (close draw)
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Draw ID
 *     responses:
 *       200:
 *         description: Draw closed
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Draw not found
 *       400:
 *         description: Draw cannot be closed
 */
router.patch('/draws/:id/close', rbac('admin'), adminController.closeDraw);

/**
 * @swagger
 * /admin/draws/{id}/draw:
 *   patch:
 *     summary: Enter winning numbers and populate results for a draw
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Draw ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               numbers:
 *                 type: array
 *                 items:
 *                   type: integer
 *               prizeTiers:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     match_count:
 *                       type: integer
 *                     prize_amount:
 *                       type: number
 *                       format: float
 *               jackpotAmount:
 *                 type: number
 *                 format: float
 *     responses:
 *       200:
 *         description: Draw results entered
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Draw not found
 *       400:
 *         description: Draw must be closed before drawing numbers
 */
router.patch('/draws/:id/draw', rbac('admin'), adminController.drawNumbers);

/**
 * @swagger
 * /admin/draws/{id}/settle:
 *   post:
 *     summary: Settle a draw (calculate prizes, create payouts, credit wallets)
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Draw ID
 *     responses:
 *       200:
 *         description: Draw settled, payouts processed
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Draw not found
 *       400:
 *         description: Draw not ready for settlement
 */
router.post('/draws/:id/settle', rbac('admin'), adminController.settleDraw);

// --- Support Management ---
/**
 * @swagger
 * /admin/support/tickets:
 *   get:
 *     summary: Get all support tickets (admin view)
 *     tags: [Admin]
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
 *       - in: query
 *         name: user_id
 *         schema:
 *           type: integer
 *         description: Filter by user ID
 *     responses:
 *       200:
 *         description: Support tickets retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TicketListResponse'
 *       401:
 *         description: Unauthorized
 */
router.get('/support/tickets', rbac('admin'), adminController.getAllSupportTickets);

/**
 * @swagger
 * /admin/support/tickets/{id}:
 *   patch:
 *     summary: Update support ticket (admin reply / close)
 *     tags: [Admin]
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateTicketRequest'
 *     responses:
 *       200:
 *         description: Support ticket updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Support ticket updated successfully"
 *                 ticket:
 *                   $ref: '#/components/schemas/SupportTicket'
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
router.patch('/support/tickets/:id', rbac('admin'), adminController.updateSupportTicket);

/**
 * @swagger
 * /admin/support/stats:
 *   get:
 *     summary: Get support ticket statistics
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Support ticket statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TicketStats'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/support/stats', rbac('admin'), adminController.getSupportTicketStats);

// --- Notification Management ---
/**
 * @swagger
 * /admin/notifications:
 *   post:
 *     summary: Create a notification for a specific user
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateNotificationRequest'
 *     responses:
 *       201:
 *         description: Notification created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Notification created successfully"
 *                 notification:
 *                   $ref: '#/components/schemas/Notification'
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
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/notifications', rbac('admin'), adminController.createNotification);

/**
 * @swagger
 * /admin/notifications/bulk:
 *   post:
 *     summary: Create notifications for multiple users
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BulkNotificationRequest'
 *     responses:
 *       201:
 *         description: Bulk notifications created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Bulk notifications created successfully"
 *                 created_count:
 *                   type: integer
 *                   example: 5
 *                 notifications:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Notification'
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
router.post('/notifications/bulk', rbac('admin'), adminController.createBulkNotification);

module.exports = router; 