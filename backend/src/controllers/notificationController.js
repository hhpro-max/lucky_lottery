const db = require('../models');
const { Op } = require('sequelize');

// --- Notification Management ---

exports.getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 20, read, type } = req.query;

    // Build where clause
    const where = { user_id: userId };
    
    if (read !== undefined) {
      where.read = read === 'true';
    }

    if (type) {
      where.type = type;
    }

    // Calculate pagination
    const offset = (page - 1) * limit;

    const notifications = await db.Notification.findAndCountAll({
      where,
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
      include: [{
        model: db.User,
        attributes: ['id', 'email']
      }]
    });

    // Get unread count for this user
    const unreadCount = await db.Notification.count({
      where: { 
        user_id: userId,
        read: false
      }
    });

    res.json({
      notifications: notifications.rows,
      unread_count: unreadCount,
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(notifications.count / limit),
        total_items: notifications.count,
        items_per_page: parseInt(limit)
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    // Find notification and ensure it belongs to the user
    const notification = await db.Notification.findOne({
      where: { 
        id: id,
        user_id: userId 
      }
    });

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    // Mark as read
    await notification.update({ read: true });

    res.json({
      message: 'Notification marked as read',
      notification: {
        id: notification.id,
        type: notification.type,
        message: notification.message,
        read: notification.read,
        created_at: notification.created_at
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.id;

    // Mark all unread notifications as read
    const result = await db.Notification.update(
      { read: true },
      { 
        where: { 
          user_id: userId,
          read: false
        }
      }
    );

    res.json({
      message: 'All notifications marked as read',
      updated_count: result[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// --- Admin Functions for Notification Management ---

exports.createNotification = async (req, res) => {
  try {
    const { user_id, type, message } = req.body;

    if (!user_id || !type || !message) {
      return res.status(400).json({ 
        message: 'User ID, type, and message are required' 
      });
    }

    // Check if user exists
    const user = await db.User.findByPk(user_id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create notification
    const notification = await db.Notification.create({
      user_id,
      type,
      message,
      read: false
    });

    res.status(201).json({
      message: 'Notification created successfully',
      notification: {
        id: notification.id,
        user_id: notification.user_id,
        type: notification.type,
        message: notification.message,
        read: notification.read,
        created_at: notification.created_at
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.createBulkNotification = async (req, res) => {
  try {
    const { user_ids, type, message } = req.body;

    if (!user_ids || !Array.isArray(user_ids) || !type || !message) {
      return res.status(400).json({ 
        message: 'User IDs array, type, and message are required' 
      });
    }

    // Check if all users exist
    const users = await db.User.findAll({
      where: { id: { [Op.in]: user_ids } }
    });

    if (users.length !== user_ids.length) {
      return res.status(400).json({ 
        message: 'Some users not found' 
      });
    }

    // Create notifications for all users
    const notifications = await Promise.all(
      user_ids.map(user_id => 
        db.Notification.create({
          user_id,
          type,
          message,
          read: false
        })
      )
    );

    res.status(201).json({
      message: 'Bulk notifications created successfully',
      created_count: notifications.length,
      notifications: notifications.map(n => ({
        id: n.id,
        user_id: n.user_id,
        type: n.type,
        message: n.message,
        read: n.read,
        created_at: n.created_at
      }))
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
}; 