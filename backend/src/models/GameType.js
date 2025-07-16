module.exports = (sequelize, DataTypes) => {
  const GameType = sequelize.define('GameType', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    rules: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  }, {
    tableName: 'game_types',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return GameType;
};
