const db = require('../models');
const { Op } = require('sequelize');

exports.getAuditLogs = async (req, res) => {
  try {
    const { actor_id, action, start_date, end_date, page = 1, limit = 20 } = req.query;
    const where = {};
    if (actor_id) where.actor_id = actor_id;
    if (action) where.action = action;
    if (start_date || end_date) {
      where.created_at = {};
      if (start_date) where.created_at[Op.gte] = new Date(start_date);
      if (end_date) where.created_at[Op.lte] = new Date(end_date);
    }
    const offset = (page - 1) * limit;
    const logs = await db.AuditLog.findAndCountAll({
      where,
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
      include: [{ model: db.User, as: 'actor', attributes: ['id', 'email'] }]
    });
    res.json({
      logs: logs.rows,
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(logs.count / limit),
        total_items: logs.count,
        items_per_page: parseInt(limit)
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
}; 