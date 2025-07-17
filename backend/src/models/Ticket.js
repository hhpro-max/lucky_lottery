module.exports = (sequelize, DataTypes) => {
  const Ticket = sequelize.define('Ticket', {
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
    lottery_draw_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'lottery_draws', key: 'id' },
      onDelete: 'CASCADE',
    },
    numbers: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      allowNull: false,
    },
    purchase_time: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'winner', 'loser'),
      allowNull: false,
      defaultValue: 'pending',
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
    tableName: 'tickets',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return Ticket;
}; 