module.exports = (sequelize, DataTypes) => {
  const PrizeTier = sequelize.define('PrizeTier', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    lottery_draw_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'lottery_draws', key: 'id' },
      onDelete: 'CASCADE',
    },
    match_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    prize_amount: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'prize_tiers',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return PrizeTier;
}; 