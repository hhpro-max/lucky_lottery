module.exports = (sequelize, DataTypes) => {
  const DrawResult = sequelize.define('DrawResult', {
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
    winning_numbers: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      allowNull: true,
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
    tableName: 'draw_results',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return DrawResult;
};
