const express = require('express');
const router = express.Router();
const auditController = require('../controllers/auditController');
const rbac = require('../middlewares/rbac');

/**
 * @swagger
 * /admin/audit-logs:
 *   get:
 *     summary: Get audit logs (admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: actor_id
 *         schema:
 *           type: integer
 *         description: Filter by actor (user ID)
 *       - in: query
 *         name: action
 *         schema:
 *           type: string
 *         description: Filter by action
 *       - in: query
 *         name: start_date
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date (YYYY-MM-DD)
 *       - in: query
 *         name: end_date
 *         schema:
 *           type: string
 *           format: date
 *         description: End date (YYYY-MM-DD)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Items per page
 *     responses:
 *       200:
 *         description: Audit logs retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 logs:
 *                   type: array
 *                   items:
 *                     type: object
 *                 pagination:
 *                   type: object
 *       401:
 *         description: Unauthorized
 */
router.get('/admin/audit-logs', rbac('admin'), auditController.getAuditLogs);

module.exports = router; 