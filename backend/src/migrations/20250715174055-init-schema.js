'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Country
    await queryInterface.createTable('countries', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      code: { type: Sequelize.STRING(2), allowNull: false, unique: true },
      name: { type: Sequelize.STRING, allowNull: false },
      currency_code: { type: Sequelize.STRING(3), allowNull: false },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    });
    // Currency
    await queryInterface.createTable('currencies', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      code: { type: Sequelize.STRING(3), allowNull: false, unique: true },
      name: { type: Sequelize.STRING, allowNull: false },
      symbol: { type: Sequelize.STRING, allowNull: false },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    });
    // User
    await queryInterface.createTable('users', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      email: { type: Sequelize.STRING, allowNull: false, unique: true },
      password_hash: { type: Sequelize.STRING, allowNull: false },
      roles: { type: Sequelize.ARRAY(Sequelize.STRING), allowNull: false, defaultValue: ['player'] },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      last_login: { type: Sequelize.DATE, allowNull: true },
      email_verified: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      status: { type: Sequelize.ENUM('active', 'locked', 'deleted'), allowNull: false, defaultValue: 'active' },
      twofa_secret: { type: Sequelize.STRING, allowNull: true },
      twofa_enabled: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      failed_login_attempts: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      lockout_until: { type: Sequelize.DATE, allowNull: true },
    });
    // Profile
    await queryInterface.createTable('profiles', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      user_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'users', key: 'id' }, onDelete: 'CASCADE' },
      name: { type: Sequelize.STRING, allowNull: false },
      dob: { type: Sequelize.DATEONLY, allowNull: false },
      address: { type: Sequelize.STRING, allowNull: true },
      phone: { type: Sequelize.STRING, allowNull: true },
      KYC_status: { type: Sequelize.STRING, allowNull: false, defaultValue: 'pending' },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    });
    // Wallet
    await queryInterface.createTable('wallets', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      user_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'users', key: 'id' }, onDelete: 'CASCADE' },
      balance: { type: Sequelize.DECIMAL(18,2), allowNull: false, defaultValue: 0.00 },
      currency_code: { type: Sequelize.STRING(3), allowNull: false, defaultValue: 'USD' },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    });
    // Transaction
    await queryInterface.createTable('transactions', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      wallet_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'wallets', key: 'id' }, onDelete: 'CASCADE' },
      type: { type: Sequelize.ENUM('debit', 'credit'), allowNull: false },
      amount: { type: Sequelize.DECIMAL(18,2), allowNull: false },
      reference: { type: Sequelize.STRING, allowNull: true },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    });
    // GameType
    await queryInterface.createTable('game_types', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: Sequelize.STRING, allowNull: false, unique: true },
      description: { type: Sequelize.STRING, allowNull: true },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    });
    // LotteryDraw
    await queryInterface.createTable('lottery_draws', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      game_type_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'game_types', key: 'id' }, onDelete: 'CASCADE' },
      draw_date: { type: Sequelize.DATE, allowNull: false },
      status: { type: Sequelize.ENUM('scheduled', 'open', 'closed', 'drawn'), allowNull: false, defaultValue: 'scheduled' },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    });
    // DrawResult
    await queryInterface.createTable('draw_results', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      lottery_draw_id: { type: Sequelize.INTEGER, allowNull: false, unique: true, references: { model: 'lottery_draws', key: 'id' }, onDelete: 'CASCADE' },
      winning_numbers: { type: Sequelize.ARRAY(Sequelize.INTEGER), allowNull: true },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    });
    // PrizeTier
    await queryInterface.createTable('prize_tiers', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      lottery_draw_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'lottery_draws', key: 'id' }, onDelete: 'CASCADE' },
      match_count: { type: Sequelize.INTEGER, allowNull: false },
      prize_amount: { type: Sequelize.DECIMAL(18,2), allowNull: false },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    });
    // Jackpot
    await queryInterface.createTable('jackpots', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      lottery_draw_id: { type: Sequelize.INTEGER, allowNull: false, unique: true, references: { model: 'lottery_draws', key: 'id' }, onDelete: 'CASCADE' },
      amount: { type: Sequelize.DECIMAL(18,2), allowNull: false },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    });
    // Ticket
    await queryInterface.createTable('tickets', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      user_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'users', key: 'id' }, onDelete: 'CASCADE' },
      lottery_draw_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'lottery_draws', key: 'id' }, onDelete: 'CASCADE' },
      numbers: { type: Sequelize.ARRAY(Sequelize.INTEGER), allowNull: false },
      purchase_time: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      status: { type: Sequelize.ENUM('active', 'winner', 'loser'), allowNull: false, defaultValue: 'active' },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    });
    // Payout
    await queryInterface.createTable('payouts', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      ticket_id: { type: Sequelize.INTEGER, allowNull: false, unique: true, references: { model: 'tickets', key: 'id' }, onDelete: 'CASCADE' },
      amount: { type: Sequelize.DECIMAL(18,2), allowNull: false },
      paid_at: { type: Sequelize.DATE, allowNull: true },
      payment_method: { type: Sequelize.STRING, allowNull: false },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    });
    // Role
    await queryInterface.createTable('roles', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: Sequelize.STRING, allowNull: false, unique: true },
      description: { type: Sequelize.STRING, allowNull: true },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    });
    // Permission
    await queryInterface.createTable('permissions', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: Sequelize.STRING, allowNull: false, unique: true },
      description: { type: Sequelize.STRING, allowNull: true },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    });
    // RolePermission
    await queryInterface.createTable('role_permissions', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      role_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'roles', key: 'id' }, onDelete: 'CASCADE' },
      perm_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'permissions', key: 'id' }, onDelete: 'CASCADE' },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    });
    // SecurityToken
    await queryInterface.createTable('security_tokens', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      user_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'users', key: 'id' }, onDelete: 'CASCADE' },
      token: { type: Sequelize.STRING, allowNull: false, unique: true },
      type: { type: Sequelize.ENUM('refresh', 'reset_password'), allowNull: false },
      expires_at: { type: Sequelize.DATE, allowNull: false },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    });
    // EmailVerification
    await queryInterface.createTable('email_verifications', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      user_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'users', key: 'id' }, onDelete: 'CASCADE' },
      token: { type: Sequelize.STRING, allowNull: false, unique: true },
      expires_at: { type: Sequelize.DATE, allowNull: false },
      verified_at: { type: Sequelize.DATE, allowNull: true },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    });
    // Affiliate
    await queryInterface.createTable('affiliates', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      user_id: { type: Sequelize.INTEGER, allowNull: false, unique: true, references: { model: 'users', key: 'id' }, onDelete: 'CASCADE' },
      code: { type: Sequelize.STRING, allowNull: false, unique: true },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    });
    // Referral
    await queryInterface.createTable('referrals', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      affiliate_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'affiliates', key: 'id' }, onDelete: 'CASCADE' },
      user_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'users', key: 'id' }, onDelete: 'CASCADE' },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    });
    // Notification
    await queryInterface.createTable('notifications', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      user_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'users', key: 'id' }, onDelete: 'CASCADE' },
      type: { type: Sequelize.STRING, allowNull: false },
      message: { type: Sequelize.STRING, allowNull: false },
      read: { type: Sequelize.BOOLEAN, defaultValue: false },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    });
    // SupportTicket
    await queryInterface.createTable('support_tickets', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      user_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'users', key: 'id' }, onDelete: 'CASCADE' },
      subject: { type: Sequelize.STRING, allowNull: false },
      message: { type: Sequelize.TEXT, allowNull: false },
      status: { type: Sequelize.ENUM('open', 'closed', 'pending'), allowNull: false, defaultValue: 'open' },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      closed_at: { type: Sequelize.DATE, allowNull: true },
    });
    // AuditLog
    await queryInterface.createTable('audit_logs', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      user_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'users', key: 'id' }, onDelete: 'CASCADE' },
      action: { type: Sequelize.STRING, allowNull: false },
      details: { type: Sequelize.JSON, allowNull: true },
      ip_address: { type: Sequelize.STRING, allowNull: true },
      timestamp: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    });
    // Setting
    await queryInterface.createTable('settings', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      key: { type: Sequelize.STRING, allowNull: false, unique: true },
      value: { type: Sequelize.STRING, allowNull: false },
      description: { type: Sequelize.STRING, allowNull: true },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    });
    // Announcement
    await queryInterface.createTable('announcements', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      title: { type: Sequelize.STRING, allowNull: false },
      message: { type: Sequelize.TEXT, allowNull: false },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      expires_at: { type: Sequelize.DATE, allowNull: true },
    });
  },

  async down (queryInterface, Sequelize) {
    // Drop tables in reverse order
    await queryInterface.dropTable('announcements');
    await queryInterface.dropTable('settings');
    await queryInterface.dropTable('audit_logs');
    await queryInterface.dropTable('support_tickets');
    await queryInterface.dropTable('notifications');
    await queryInterface.dropTable('referrals');
    await queryInterface.dropTable('affiliates');
    await queryInterface.dropTable('email_verifications');
    await queryInterface.dropTable('security_tokens');
    await queryInterface.dropTable('role_permissions');
    await queryInterface.dropTable('permissions');
    await queryInterface.dropTable('roles');
    await queryInterface.dropTable('payouts');
    await queryInterface.dropTable('tickets');
    await queryInterface.dropTable('jackpots');
    await queryInterface.dropTable('prize_tiers');
    await queryInterface.dropTable('draw_results');
    await queryInterface.dropTable('lottery_draws');
    await queryInterface.dropTable('game_types');
    await queryInterface.dropTable('transactions');
    await queryInterface.dropTable('wallets');
    await queryInterface.dropTable('profiles');
    await queryInterface.dropTable('users');
    await queryInterface.dropTable('currencies');
    await queryInterface.dropTable('countries');
  }
};
