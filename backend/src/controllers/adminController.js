const db = require('../models');

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
    // Optionally: validate roles against allowed roles
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
    // Create DrawResult
    const drawResult = await db.DrawResult.create({
      lottery_draw_id: id,
      numbers,
      draw_time: new Date(),
    });
    // Create PrizeTiers
    if (Array.isArray(prizeTiers)) {
      for (const tier of prizeTiers) {
        await db.PrizeTier.create({
          lottery_draw_id: id,
          match_count: tier.match_count,
          prize_amount: tier.prize_amount,
        });
      }
    }
    // Create Jackpot
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
    // 1. Find draw, result, prize tiers
    const draw = await db.LotteryDraw.findByPk(id, { transaction: t });
    if (!draw) return res.status(404).json({ message: 'Draw not found' });
    if (draw.status !== 'completed') return res.status(400).json({ message: 'Draw not ready for settlement' });
    const drawResult = await db.DrawResult.findOne({ where: { lottery_draw_id: id }, transaction: t });
    if (!drawResult) return res.status(400).json({ message: 'Draw result not entered' });
    const prizeTiers = await db.PrizeTier.findAll({ where: { lottery_draw_id: id }, transaction: t });
    if (!prizeTiers.length) return res.status(400).json({ message: 'No prize tiers defined' });
    // 2. Get all tickets for this draw
    const tickets = await db.Ticket.findAll({ where: { lottery_draw_id: id, status: 'pending' }, transaction: t });
    if (!tickets.length) return res.json({ message: 'No tickets to settle' });
    // 3. Prepare prize tier map
    const tierMap = {};
    for (const tier of prizeTiers) tierMap[tier.match_count] = parseFloat(tier.prize_amount);
    // 4. Match tickets, create payouts, update wallets
    let payoutCount = 0, totalPaid = 0;
    for (const ticket of tickets) {
      // Count matching numbers
      const matchCount = ticket.numbers.filter(n => drawResult.numbers.includes(n)).length;
      const prize = tierMap[matchCount];
      if (prize) {
        // Winner: create payout, credit wallet, update ticket
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
        // Not a winner
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