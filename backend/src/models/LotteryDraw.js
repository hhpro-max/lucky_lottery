module.exports = (sequelize, DataTypes) => {
  const LotteryDraw = sequelize.define('LotteryDraw', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    game_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'game_types', key: 'id' },
      onDelete: 'CASCADE',
    },
    draw_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('scheduled', 'completed', 'cancelled'),
      allowNull: false,
      defaultValue: 'scheduled',
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
    tableName: 'lottery_draws',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return LotteryDraw;
};