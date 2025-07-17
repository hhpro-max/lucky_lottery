const db = require('../models');

// Helper: parse rules JSON from GameType.rules
function parseRules(rules) {
  try {
    return rules ? JSON.parse(rules) : {};
  } catch {
    return {};
  }
}

exports.purchaseTicket = async (req, res) => {
  const t = await db.sequelize.transaction();
  try {
    const { lottery_draw_id, numbers } = req.body;
    if (!lottery_draw_id || !Array.isArray(numbers)) {
      return res.status(400).json({ message: 'Missing draw or numbers' });
    }
    // 1. Validate draw
    const draw = await db.LotteryDraw.findByPk(lottery_draw_id, { transaction: t });
    if (!draw) return res.status(404).json({ message: 'Draw not found' });
    if (draw.status !== 'scheduled') return res.status(400).json({ message: 'Draw not open for ticket sales' });
    // 2. Get game type and rules
    const gameType = await db.GameType.findByPk(draw.game_type_id, { transaction: t });
    if (!gameType || !gameType.active) return res.status(400).json({ message: 'Game type not available' });
    const rules = parseRules(gameType.rules);
    // 3. Validate numbers (basic: count, range)
    if (rules.numbers && numbers.length !== rules.numbers) {
      return res.status(400).json({ message: `You must pick ${rules.numbers} numbers` });
    }
    if (rules.min !== undefined && rules.max !== undefined) {
      for (const n of numbers) {
        if (typeof n !== 'number' || n < rules.min || n > rules.max) {
          return res.status(400).json({ message: `Numbers must be between ${rules.min} and ${rules.max}` });
        }
      }
    }
    // 4. Get ticket price (from rules or default setting)
    let price = 1;
    if (rules.ticket_price) price = parseFloat(rules.ticket_price);
    else {
      const setting = await db.Setting.findOne({ where: { key: 'min_ticket_price' }, transaction: t });
      if (setting) price = parseFloat(setting.value);
    }
    // 5. Check wallet balance
    const wallet = await db.Wallet.findOne({ where: { user_id: req.user.id }, transaction: t });
    if (!wallet || parseFloat(wallet.balance) < price) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }
    // 6. Deduct balance
    await wallet.update({ balance: parseFloat(wallet.balance) - price }, { transaction: t });
    // 7. Create ticket
    const ticket = await db.Ticket.create({
      user_id: req.user.id,
      lottery_draw_id,
      numbers,
      purchase_time: new Date(),
      status: 'pending',
    }, { transaction: t });
    await t.commit();
    res.status(201).json(ticket);
  } catch (err) {
    await t.rollback();
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.listTickets = async (req, res) => {
  try {
    const { draw } = req.query;
    const where = { user_id: req.user.id };
    if (draw) where.lottery_draw_id = draw;
    const tickets = await db.Ticket.findAll({ where });
    res.json(tickets);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getTicketDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const ticket = await db.Ticket.findByPk(id);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
    if (ticket.user_id !== req.user.id && !req.user.roles.includes('admin')) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    res.json(ticket);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getDrawResult = async (req, res) => {
  try {
    const { drawId } = req.params;
    const draw = await db.LotteryDraw.findByPk(drawId);
    if (!draw) return res.status(404).json({ message: 'Draw not found' });
    const result = await db.DrawResult.findOne({ where: { lottery_draw_id: drawId } });
    if (!result) return res.status(404).json({ message: 'Draw result not found' });
    const prizeTiers = await db.PrizeTier.findAll({ where: { lottery_draw_id: drawId } });
    const jackpot = await db.Jackpot.findOne({ where: { lottery_draw_id: drawId } });
    res.json({ result, prizeTiers, jackpot });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
}; 