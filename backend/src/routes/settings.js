const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');
const rbac = require('../middlewares/rbac');

/**
 * @swagger
 * /settings:
 *   get:
 *     summary: Get all system settings
 *     tags: [Settings]
 *     responses:
 *       200:
 *         description: List of settings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       500:
 *         description: Internal server error
 */
router.get('/', settingsController.getSettings);

/**
 * @swagger
 * /settings/{key}:
 *   patch:
 *     summary: Update a system setting (admin only)
 *     tags: [Settings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: key
 *         schema:
 *           type: string
 *         required: true
 *         description: Setting key
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               value:
 *                 type: string
 *     responses:
 *       200:
 *         description: Setting updated
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Setting not found
 */
router.patch('/:key', rbac('admin'), settingsController.updateSetting);

module.exports = router; 