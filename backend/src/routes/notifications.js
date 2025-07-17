const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const auth = require('../middlewares/auth');
const validate = require('../middlewares/validate');

/**
 * @swagger
 * components:
 *   schemas:
 *     Notification:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         user_id:
 *           type: integer
 *           example: 1
 *         type:
 *           type: string
 *           example: "system"
 *         message:
 *           type: string
 *           example: "Your account has been verified successfully"
 *         read:
 *           type: boolean
 *           example: false
 *         created_at:
 *           type: string
 *           format: date-time
 *           example: "2024-01-15T10:30:00.000Z"
 *         user:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *               example: 1
 *             email:
 *               type: string
 *               example: "user@example.com"
 *     NotificationListResponse:
 *       type: object
 *       properties:
 *         notifications:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Notification'
 *         unread_count:
 *           type: integer
 *           example: 5
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
 *     CreateNotificationRequest:
 *       type: object
 *       required:
 *         - user_id
 *         - type
 *         - message
 *       properties:
 *         user_id:
 *           type: integer
 *           example: 1
 *           description: ID of the user to notify
 *         type:
 *           type: string
 *           example: "system"
 *           description: Type of notification (system, deposit, withdrawal, etc.)
 *         message:
 *           type: string
 *           example: "Your deposit has been processed successfully"
 *           description: Notification message
 *     BulkNotificationRequest:
 *       type: object
 *       required:
 *         - user_ids
 *         - type
 *         - message
 *       properties:
 *         user_ids:
 *           type: array
 *           items:
 *             type: integer
 *           example: [1, 2, 3]
 *           description: Array of user IDs to notify
 *         type:
 *           type: string
 *           example: "announcement"
 *           description: Type of notification
 *         message:
 *           type: string
 *           example: "System maintenance scheduled for tomorrow"
 *           description: Notification message
 */

/**
 * @swagger
 * /notifications:
 *   get:
 *     summary: Get user's notifications
 *     tags: [Notifications]
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
 *         description: Number of notifications per page
 *       - in: query
 *         name: read
 *         schema:
 *           type: string
 *           enum: [true, false]
 *         description: Filter by read status
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: Filter by notification type
 *     responses:
 *       200:
 *         description: Notifications retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotificationListResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', auth, notificationController.getNotifications);

/**
 * @swagger
 * /notifications/{id}/read:
 *   patch:
 *     summary: Mark a notification as read
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Notification ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Notification marked as read
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Notification marked as read"
 *                 notification:
 *                   $ref: '#/components/schemas/Notification'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Notification not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.patch('/:id/read', auth, notificationController.markAsRead);

/**
 * @swagger
 * /notifications/read-all:
 *   patch:
 *     summary: Mark all notifications as read
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All notifications marked as read
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "All notifications marked as read"
 *                 updated_count:
 *                   type: integer
 *                   example: 5
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.patch('/read-all', auth, notificationController.markAllAsRead);

module.exports = router; 