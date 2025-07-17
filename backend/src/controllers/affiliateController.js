const db = require('../models');
const { Op } = require('sequelize');

// --- Affiliate Management ---

exports.getAffiliateStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find affiliate record
    const affiliate = await db.Affiliate.findOne({
      where: { user_id: userId },
      include: [{
        model: db.User,
        attributes: ['id', 'email']
      }]
    });

    if (!affiliate) {
      return res.status(404).json({ message: 'Affiliate account not found' });
    }

    // Get referral count
    const referralCount = await db.Referral.count({
      where: { affiliate_id: affiliate.id }
    });

    // Get recent referrals (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentReferrals = await db.Referral.count({
      where: { 
        affiliate_id: affiliate.id,
        created_at: { [Op.gte]: thirtyDaysAgo }
      }
    });

    // Calculate commission earned (this would be calculated from actual transactions)
    // For now, we'll use a placeholder calculation
    const commissionEarned = parseFloat(affiliate.commission_earned || 0);

    res.json({
      affiliate_code: affiliate.code,
      total_referrals: referralCount,
      recent_referrals: recentReferrals,
      commission_earned: commissionEarned,
      user: affiliate.User
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.createReferral = async (req, res) => {
  try {
    const userId = req.user.id;
    const { referred_email, referred_name } = req.body;

    if (!referred_email || !referred_name) {
      return res.status(400).json({ 
        message: 'Referred email and name are required' 
      });
    }

    // Find affiliate record
    const affiliate = await db.Affiliate.findOne({
      where: { user_id: userId }
    });

    if (!affiliate) {
      return res.status(404).json({ message: 'Affiliate account not found' });
    }

    // Check if referred user exists
    const referredUser = await db.User.findOne({
      where: { email: referred_email }
    });

    if (!referredUser) {
      return res.status(404).json({ 
        message: 'Referred user not found. They must register first.' 
      });
    }

    // Check if referral already exists
    const existingReferral = await db.Referral.findOne({
      where: { 
        affiliate_id: affiliate.id,
        user_id: referredUser.id
      }
    });

    if (existingReferral) {
      return res.status(409).json({ 
        message: 'Referral already exists for this user' 
      });
    }

    // Check if user is trying to refer themselves
    if (referredUser.id === userId) {
      return res.status(400).json({ 
        message: 'You cannot refer yourself' 
      });
    }

    // Create referral
    const referral = await db.Referral.create({
      affiliate_id: affiliate.id,
      user_id: referredUser.id
    });

    // Update affiliate referral count
    await affiliate.increment('referred_count');

    res.status(201).json({
      message: 'Referral created successfully',
      referral: {
        id: referral.id,
        referred_user: {
          id: referredUser.id,
          email: referredUser.email,
          name: referred_name
        },
        created_at: referral.created_at
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getReferrals = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 20, status } = req.query;

    // Find affiliate record
    const affiliate = await db.Affiliate.findOne({
      where: { user_id: userId }
    });

    if (!affiliate) {
      return res.status(404).json({ message: 'Affiliate account not found' });
    }

    // Build where clause
    const where = { affiliate_id: affiliate.id };

    // Calculate pagination
    const offset = (page - 1) * limit;

    const referrals = await db.Referral.findAndCountAll({
      where,
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
      include: [
        {
          model: db.User,
          as: 'User',
          attributes: ['id', 'email', 'status', 'created_at'],
          include: [{
            model: db.Profile,
            attributes: ['name', 'KYC_status']
          }]
        }
      ]
    });

    // Transform data to include user status and KYC info
    const transformedReferrals = referrals.rows.map(referral => ({
      id: referral.id,
      referred_at: referral.created_at,
      user: {
        id: referral.User.id,
        email: referral.User.email,
        status: referral.User.status,
        joined_at: referral.User.created_at,
        profile: referral.User.Profile ? {
          name: referral.User.Profile.name,
          KYC_status: referral.User.Profile.KYC_status
        } : null
      }
    }));

    res.json({
      referrals: transformedReferrals,
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(referrals.count / limit),
        total_items: referrals.count,
        items_per_page: parseInt(limit)
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// --- Admin Functions for Affiliate Management ---

exports.createAffiliateAccount = async (req, res) => {
  try {
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    // Check if user exists
    const user = await db.User.findByPk(user_id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if affiliate account already exists
    const existingAffiliate = await db.Affiliate.findOne({
      where: { user_id: user_id }
    });

    if (existingAffiliate) {
      return res.status(409).json({ 
        message: 'Affiliate account already exists for this user' 
      });
    }

    // Generate unique affiliate code
    const generateCode = () => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let code = '';
      for (let i = 0; i < 8; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return code;
    };

    let code;
    let isUnique = false;
    while (!isUnique) {
      code = generateCode();
      const existingCode = await db.Affiliate.findOne({ where: { code } });
      if (!existingCode) {
        isUnique = true;
      }
    }

    // Create affiliate account
    const affiliate = await db.Affiliate.create({
      user_id: user_id,
      code: code,
      referred_count: 0,
      commission_earned: 0.00
    });

    res.status(201).json({
      message: 'Affiliate account created successfully',
      affiliate: {
        id: affiliate.id,
        user_id: affiliate.user_id,
        code: affiliate.code,
        referred_count: affiliate.referred_count,
        commission_earned: affiliate.commission_earned
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
}; 