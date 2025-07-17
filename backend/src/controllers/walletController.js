const db = require('../models');
const { Op } = require('sequelize');

// --- Wallet Management ---

exports.getWallet = async (req, res) => {
  try {
    const userId = req.user.id;
    const wallet = await db.Wallet.findOne({ 
      where: { user_id: userId },
      include: [{
        model: db.User,
        attributes: ['id', 'email']
      }]
    });

    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found' });
    }

    res.json({
      id: wallet.id,
      balance: wallet.balance,
      currency_code: wallet.currency_code,
      user: wallet.User
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.deposit = async (req, res) => {
  const t = await db.sequelize.transaction();
  try {
    const userId = req.user.id;
    const { amount, payment_method, reference } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    // Find user's wallet
    const wallet = await db.Wallet.findOne({ 
      where: { user_id: userId },
      transaction: t 
    });

    if (!wallet) {
      await t.rollback();
      return res.status(404).json({ message: 'Wallet not found' });
    }

    // Create transaction record
    const transaction = await db.Transaction.create({
      wallet_id: wallet.id,
      type: 'credit',
      amount: amount,
      reference: reference || `Deposit via ${payment_method}`
    }, { transaction: t });

    // Update wallet balance
    await wallet.increment('balance', { 
      by: amount,
      transaction: t 
    });

    await t.commit();

    res.status(201).json({
      message: 'Deposit successful',
      transaction: {
        id: transaction.id,
        type: transaction.type,
        amount: transaction.amount,
        reference: transaction.reference,
        created_at: transaction.created_at
      },
      new_balance: parseFloat(wallet.balance) + parseFloat(amount)
    });
  } catch (err) {
    await t.rollback();
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.withdraw = async (req, res) => {
  const t = await db.sequelize.transaction();
  try {
    const userId = req.user.id;
    const { amount, withdrawal_method, reference } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    // Find user's wallet
    const wallet = await db.Wallet.findOne({ 
      where: { user_id: userId },
      transaction: t 
    });

    if (!wallet) {
      await t.rollback();
      return res.status(404).json({ message: 'Wallet not found' });
    }

    // Check if user has sufficient balance
    if (parseFloat(wallet.balance) < parseFloat(amount)) {
      await t.rollback();
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    // Create transaction record
    const transaction = await db.Transaction.create({
      wallet_id: wallet.id,
      type: 'debit',
      amount: amount,
      reference: reference || `Withdrawal via ${withdrawal_method}`
    }, { transaction: t });

    // Update wallet balance
    await wallet.decrement('balance', { 
      by: amount,
      transaction: t 
    });

    await t.commit();

    res.status(201).json({
      message: 'Withdrawal successful',
      transaction: {
        id: transaction.id,
        type: transaction.type,
        amount: transaction.amount,
        reference: transaction.reference,
        created_at: transaction.created_at
      },
      new_balance: parseFloat(wallet.balance) - parseFloat(amount)
    });
  } catch (err) {
    await t.rollback();
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// --- Transaction Management ---

exports.getTransactions = async (req, res) => {
  try {
    const userId = req.user.id;
    const { type, start_date, end_date, page = 1, limit = 20 } = req.query;

    // Find user's wallet
    const wallet = await db.Wallet.findOne({ where: { user_id: userId } });
    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found' });
    }

    // Build where clause
    const where = { wallet_id: wallet.id };
    
    if (type) {
      where.type = type;
    }

    if (start_date || end_date) {
      where.created_at = {};
      if (start_date) {
        where.created_at[Op.gte] = new Date(start_date);
      }
      if (end_date) {
        where.created_at[Op.lte] = new Date(end_date);
      }
    }

    // Calculate pagination
    const offset = (page - 1) * limit;

    const transactions = await db.Transaction.findAndCountAll({
      where,
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
      include: [{
        model: db.Wallet,
        attributes: ['id', 'currency_code']
      }]
    });

    res.json({
      transactions: transactions.rows,
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(transactions.count / limit),
        total_items: transactions.count,
        items_per_page: parseInt(limit)
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getTransaction = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    // Find user's wallet
    const wallet = await db.Wallet.findOne({ where: { user_id: userId } });
    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found' });
    }

    // Find transaction
    const transaction = await db.Transaction.findOne({
      where: { 
        id: id,
        wallet_id: wallet.id 
      },
      include: [{
        model: db.Wallet,
        attributes: ['id', 'currency_code']
      }]
    });

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.json(transaction);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
}; 