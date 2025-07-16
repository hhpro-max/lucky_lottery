module.exports = (sequelize, DataTypes) => {
  const Affiliate = sequelize.define('Affiliate', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
      onDelete: 'CASCADE',
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    referred_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    commission_earned: {
      type: DataTypes.DECIMAL(18, 2),
      defaultValue: 0.00,
    },
  }, {
    tableName: 'affiliates',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return Affiliate;
};
