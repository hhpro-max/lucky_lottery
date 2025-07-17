const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: false,
  }
);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;


// Model imports
db.User = require('./User')(sequelize, Sequelize);
db.Profile = require('./Profile')(sequelize, Sequelize);
db.Wallet = require('./Wallet')(sequelize, Sequelize);
db.Transaction = require('./Transaction')(sequelize, Sequelize);
db.GameType = require('./GameType')(sequelize, Sequelize);
db.LotteryDraw = require('./LotteryDraw')(sequelize, Sequelize);
db.DrawResult = require('./DrawResult')(sequelize, Sequelize);
db.PrizeTier = require('./PrizeTier')(sequelize, Sequelize);
db.Jackpot = require('./Jackpot')(sequelize, Sequelize);
db.Ticket = require('./Ticket')(sequelize, Sequelize);
db.Payout = require('./Payout')(sequelize, Sequelize);
db.Affiliate = require('./Affiliate')(sequelize, Sequelize);
db.Referral = require('./Referral')(sequelize, Sequelize);
db.Notification = require('./Notification')(sequelize, Sequelize);
db.SupportTicket = require('./SupportTicket')(sequelize, Sequelize);
db.AuditLog = require('./AuditLog')(sequelize, Sequelize);
db.Setting = require('./Setting')(sequelize, Sequelize);
db.Country = require('./Country')(sequelize, Sequelize);
db.Currency = require('./Currency')(sequelize, Sequelize);
db.EmailVerification = require('./EmailVerification')(sequelize, Sequelize);
db.Role = require('./Role')(sequelize, Sequelize);
db.Permission = require('./Permission')(sequelize, Sequelize);
db.RolePermission = require('./RolePermission')(sequelize, Sequelize);
db.SecurityToken = require('./SecurityToken')(sequelize, Sequelize);
db.Announcement = require('./Announcement')(sequelize, Sequelize);

// Associations
// User
db.User.hasOne(db.Profile, { foreignKey: 'user_id' });
db.Profile.belongsTo(db.User, { foreignKey: 'user_id' });
db.User.hasOne(db.Wallet, { foreignKey: 'user_id' });
db.Wallet.belongsTo(db.User, { foreignKey: 'user_id' });
db.User.hasMany(db.Ticket, { foreignKey: 'user_id' });
db.Ticket.belongsTo(db.User, { foreignKey: 'user_id' });
db.User.hasMany(db.Notification, { foreignKey: 'user_id' });
db.Notification.belongsTo(db.User, { foreignKey: 'user_id' });
db.User.hasMany(db.SupportTicket, { foreignKey: 'user_id' });
db.SupportTicket.belongsTo(db.User, { foreignKey: 'user_id' });
db.User.hasMany(db.AuditLog, { foreignKey: 'actor_id' });
db.AuditLog.belongsTo(db.User, { foreignKey: 'actor_id', as: 'actor' });
db.User.hasMany(db.EmailVerification, { foreignKey: 'user_id' });
db.EmailVerification.belongsTo(db.User, { foreignKey: 'user_id' });
db.User.hasMany(db.SecurityToken, { foreignKey: 'user_id' });
db.SecurityToken.belongsTo(db.User, { foreignKey: 'user_id' });
db.User.hasOne(db.Affiliate, { foreignKey: 'user_id' });
db.Affiliate.belongsTo(db.User, { foreignKey: 'user_id' });

// Affiliate/Referral
db.Affiliate.hasMany(db.Referral, { foreignKey: 'affiliate_id' });
db.Referral.belongsTo(db.Affiliate, { foreignKey: 'affiliate_id' });
db.Referral.belongsTo(db.User, { foreignKey: 'user_id' });

// Wallet/Transaction
db.Wallet.hasMany(db.Transaction, { foreignKey: 'wallet_id' });
db.Transaction.belongsTo(db.Wallet, { foreignKey: 'wallet_id' });


// GameType/LotteryDraw
db.GameType.hasMany(db.LotteryDraw, { foreignKey: 'game_type_id' });
db.LotteryDraw.belongsTo(db.GameType, { foreignKey: 'game_type_id' });

// LotteryDraw relations (use lottery_draw_id)
db.LotteryDraw.hasMany(db.Ticket, { foreignKey: 'lottery_draw_id' });
db.Ticket.belongsTo(db.LotteryDraw, { foreignKey: 'lottery_draw_id' });
db.LotteryDraw.hasMany(db.PrizeTier, { foreignKey: 'lottery_draw_id' });
db.PrizeTier.belongsTo(db.LotteryDraw, { foreignKey: 'lottery_draw_id' });
db.LotteryDraw.hasOne(db.Jackpot, { foreignKey: 'lottery_draw_id' });
db.Jackpot.belongsTo(db.LotteryDraw, { foreignKey: 'lottery_draw_id' });
db.LotteryDraw.hasOne(db.DrawResult, { foreignKey: 'lottery_draw_id' });
db.DrawResult.belongsTo(db.LotteryDraw, { foreignKey: 'lottery_draw_id' });

// Ticket/Payout
db.Ticket.hasOne(db.Payout, { foreignKey: 'ticket_id' });
db.Payout.belongsTo(db.Ticket, { foreignKey: 'ticket_id' });

// Role/Permission
db.Role.belongsToMany(db.Permission, { through: db.RolePermission, foreignKey: 'role_id', otherKey: 'perm_id' });
db.Permission.belongsToMany(db.Role, { through: db.RolePermission, foreignKey: 'perm_id', otherKey: 'role_id' });

module.exports = db;

module.exports = db; 