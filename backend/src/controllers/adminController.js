const db = require('../models');

// --- User Management ---

exports.listUsers = async (req, res) => {
  try {
    const users = await db.User.findAll({ attributes: { exclude: ['password_hash'] } });
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.updateUserRoles = async (req, res) => {
  try {
    const { id } = req.params;
    const { roles } = req.body;
    if (!Array.isArray(roles) || roles.length === 0) {
      return res.status(400).json({ message: 'Roles must be a non-empty array' });
    }
    const allowedRoles = ['player', 'admin'];
    if (!roles.every(r => allowedRoles.includes(r))) {
      return res.status(400).json({ message: 'Invalid role(s) specified' });
    }
    const user = await db.User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.roles = roles;
    await user.save();
    res.json({ message: 'User roles updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await db.User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    await user.destroy();
    res.json({ message: 'User deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// --- GameType Management ---

exports.listGameTypes = async (req, res) => {
  try {
    const gameTypes = await db.GameType.findAll();
    res.json(gameTypes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.createGameType = async (req, res) => {
  try {
    const { name, description, rules, active } = req.body;
    const exists = await db.GameType.findOne({ where: { name } });
    if (exists) return res.status(409).json({ message: 'Game type already exists' });
    const gameType = await db.GameType.create({ name, description, rules, active });
    res.status(201).json(gameType);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.updateGameType = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, rules, active } = req.body;
    const gameType = await db.GameType.findByPk(id);
    if (!gameType) return res.status(404).json({ message: 'Game type not found' });
    await gameType.update({ name, description, rules, active });
    res.json(gameType);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.deleteGameType = async (req, res) => {
  try {
    const { id } = req.params;
    const gameType = await db.GameType.findByPk(id);
    if (!gameType) return res.status(404).json({ message: 'Game type not found' });
    await gameType.destroy();
    res.json({ message: 'Game type deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// --- Draw Management ---

exports.listDraws = async (req, res) => {
  try {
    const { status } = req.query;
    const where = status ? { status } : {};
    const draws = await db.LotteryDraw.findAll({ where, include: [db.GameType] });
    res.json(draws);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// --- Support Ticket Management ---

exports.getAllSupportTickets = async (req, res) => {
  try {
    const { status, user_id, page = 1, pageSize = 20 } = req.query;
    const where = {};
    if (status) where.status = status;
    if (user_id) where.user_id = user_id;
    const offset = (parseInt(page) - 1) * parseInt(pageSize);
    const tickets = await db.SupportTicket.findAndCountAll({
      where,
      limit: parseInt(pageSize),
      offset,
      order: [['created_at', 'DESC']],
      include: [{ model: db.User, attributes: ['id', 'email'] }],
    });
    res.json({
      tickets: tickets.rows,
      total: tickets.count,
      page: parseInt(page),
      pageSize: parseInt(pageSize),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
 
// PATCH /admin/support/tickets/:id
exports.updateSupportTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, admin_reply } = req.body;
    const ticket = await db.SupportTicket.findByPk(id);
    if (!ticket) return res.status(404).json({ message: 'Support ticket not found' });
    if (status) ticket.status = status;
    if (admin_reply) ticket.admin_reply = admin_reply;
    if (status === 'closed') ticket.closed_at = new Date();
    await ticket.save();
    res.json({ message: 'Support ticket updated', ticket });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.createDraw = async (req, res) => {
  try {
    const { game_type_id, draw_time } = req.body;
    const gameType = await db.GameType.findByPk(game_type_id);
    if (!gameType) return res.status(404).json({ message: 'Game type not found' });
    const draw = await db.LotteryDraw.create({ game_type_id, draw_time, status: 'scheduled' });
    res.status(201).json(draw);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.closeDraw = async (req, res) => {
  try {
    const { id } = req.params;
    const draw = await db.LotteryDraw.findByPk(id);
    if (!draw) return res.status(404).json({ message: 'Draw not found' });
    if (draw.status !== 'scheduled') return res.status(400).json({ message: 'Draw cannot be closed' });
    draw.status = 'completed';
    await draw.save();
    res.json({ message: 'Draw closed (ticket sales stopped)' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.drawNumbers = async (req, res) => {
  try {
    const { id } = req.params;
    const { numbers, prizeTiers, jackpotAmount } = req.body;
    const draw = await db.LotteryDraw.findByPk(id);
    if (!draw) return res.status(404).json({ message: 'Draw not found' });
    if (draw.status !== 'completed') return res.status(400).json({ message: 'Draw must be closed before drawing numbers' });

    const drawResult = await db.DrawResult.create({
      lottery_draw_id: id,
      numbers,
      draw_time: new Date(),
    });

    if (Array.isArray(prizeTiers)) {
      for (const tier of prizeTiers) {
        await db.PrizeTier.create({
          lottery_draw_id: id,
          match_count: tier.match_count,
          prize_amount: tier.prize_amount,
        });
      }
    }

    if (jackpotAmount) {
      await db.Jackpot.create({
        lottery_draw_id: id,
        amount: jackpotAmount,
        rolled_over: false,
      });
    }

    res.json({ message: 'Draw results entered', drawResult });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.settleDraw = async (req, res) => {
  const { id } = req.params;
  const t = await db.sequelize.transaction();
  try {
    const draw = await db.LotteryDraw.findByPk(id, { transaction: t });
    if (!draw) return res.status(404).json({ message: 'Draw not found' });
    if (draw.status !== 'completed') return res.status(400).json({ message: 'Draw not ready for settlement' });

    const drawResult = await db.DrawResult.findOne({ where: { lottery_draw_id: id }, transaction: t });
    if (!drawResult) return res.status(400).json({ message: 'Draw result not entered' });

    const prizeTiers = await db.PrizeTier.findAll({ where: { lottery_draw_id: id }, transaction: t });
    if (!prizeTiers.length) return res.status(400).json({ message: 'No prize tiers defined' });

    const tickets = await db.Ticket.findAll({ where: { lottery_draw_id: id, status: 'pending' }, transaction: t });
    if (!tickets.length) return res.json({ message: 'No tickets to settle' });

    const tierMap = {};
    for (const tier of prizeTiers) {
      tierMap[tier.match_count] = parseFloat(tier.prize_amount);
    }

    let payoutCount = 0;
    let totalPaid = 0;

    for (const ticket of tickets) {
      const matchCount = ticket.numbers.filter(n => drawResult.numbers.includes(n)).length;
      const prize = tierMap[matchCount];

      if (prize) {
        await db.Payout.create({
          user_id: ticket.user_id,
          ticket_id: ticket.id,
          amount: prize,
          status: 'completed',
          processed_at: new Date(),
        }, { transaction: t });

        await db.Wallet.increment(
          { balance: prize },
          { where: { user_id: ticket.user_id }, transaction: t }
        );

        await ticket.update({ status: 'winner' }, { transaction: t });
        payoutCount++;
        totalPaid += prize;
      } else {
        await ticket.update({ status: 'loser' }, { transaction: t });
      }
    }

    await t.commit();
    res.json({ message: 'Draw settled', payoutCount, totalPaid });
  } catch (err) {
    await t.rollback();
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getSupportTicketStats = async (req, res) => {
  try {
    const open = await db.SupportTicket.count({ where: { status: 'open' } });
    const closed = await db.SupportTicket.count({ where: { status: 'closed' } });
    const pending = await db.SupportTicket.count({ where: { status: 'pending' } });
    res.json({ open, closed, pending });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.createNotification = async (req, res) => {
  try {
    const { user_id, title, message, type } = req.body;
    if (!user_id || !title || !message) {
      return res.status(400).json({ message: 'user_id, title, and message are required' });
    }
    const notification = await db.Notification.create({
      user_id,
      title,
      message,
      type: type || 'info',
      read: false,
      created_at: new Date()
    });
    res.status(201).json({ message: 'Notification created', notification });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.createBulkNotification = async (req, res) => {
  try {
    const { user_ids, title, message, type } = req.body;
    if (!Array.isArray(user_ids) || user_ids.length === 0 || !title || !message) {
      return res.status(400).json({ message: 'user_ids (array), title, and message are required' });
    }
    const notifications = await Promise.all(user_ids.map(user_id =>
      db.Notification.create({
        user_id,
        title,
        message,
        type: type || 'info',
        read: false,
        created_at: new Date()
      })
    ));
    res.status(201).json({ message: 'Bulk notifications created', notifications });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
