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
      unique: true,
      references: { model: 'lottery_draws', key: 'id' },
      onDelete: 'CASCADE',
    },
    winning_numbers: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      allowNull: false,
    },
    result_time: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    published: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  }, {
    tableName: 'draw_results',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return DrawResult;
};
