const db = require('../models');

exports.listPayouts = async (req, res) => {
  try {
    const { user, draw } = req.query;
    const where = {};
    // Only admin can filter by user
    if (user) {
      if (!req.user.roles.includes('admin')) return res.status(403).json({ message: 'Forbidden' });
      where.user_id = user;
    } else if (!req.user.roles.includes('admin')) {
      where.user_id = req.user.id;
    }
    if (draw) {
      // Join Ticket to filter by draw
      const tickets = await db.Ticket.findAll({ where: { lottery_draw_id: draw }, attributes: ['id'] });
      where.ticket_id = tickets.map(t => t.id);
      if (!where.ticket_id.length) return res.json([]);
    }
    const payouts = await db.Payout.findAll({ where });
    res.json(payouts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getPayoutDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const payout = await db.Payout.findByPk(id);
    if (!payout) return res.status(404).json({ message: 'Payout not found' });
    if (!req.user.roles.includes('admin') && payout.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    res.json(payout);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
}; 