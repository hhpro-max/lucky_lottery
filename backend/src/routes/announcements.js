const express = require('express');
const router = express.Router();
const announcementController = require('../controllers/announcementController');
const rbac = require('../middlewares/rbac');

/**
 * @swagger
 * /announcements:
 *   get:
 *     summary: Get all announcements
 *     tags: [Announcements]
 *     parameters:
 *       - in: query
 *         name: active
 *         schema:
 *           type: boolean
 *         description: Filter by active status
 *     responses:
 *       200:
 *         description: List of announcements
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       500:
 *         description: Internal server error
 *   post:
 *     summary: Create a new announcement (admin only)
 *     tags: [Announcements]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               message:
 *                 type: string
 *               published_at:
 *                 type: string
 *                 format: date-time
 *               active:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Announcement created
 *       401:
 *         description: Unauthorized
 */
router.get('/', announcementController.getAnnouncements);
router.post('/', rbac('admin'), announcementController.createAnnouncement);

/**
 * @swagger
 * /announcements/{id}:
 *   patch:
 *     summary: Update an announcement (admin only)
 *     tags: [Announcements]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Announcement ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               message:
 *                 type: string
 *               published_at:
 *                 type: string
 *                 format: date-time
 *               active:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Announcement updated
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Announcement not found
 *   delete:
 *     summary: Delete an announcement (admin only)
 *     tags: [Announcements]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Announcement ID
 *     responses:
 *       200:
 *         description: Announcement deleted
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Announcement not found
 */
router.patch('/:id', rbac('admin'), announcementController.updateAnnouncement);
router.delete('/:id', rbac('admin'), announcementController.deleteAnnouncement);

module.exports = router; 