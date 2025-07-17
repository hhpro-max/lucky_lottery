module.exports = (sequelize, DataTypes) => {
  const Referral = sequelize.define('Referral', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    affiliate_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'affiliates', key: 'id' },
      onDelete: 'CASCADE',
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
      onDelete: 'CASCADE',
    },
    referred_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'referrals',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return Referral;
};
