module.exports = (sequelize, DataTypes) => {
  const SecurityToken = sequelize.define('SecurityToken', {
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
    token: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    type: {
      type: DataTypes.ENUM('refresh', 'reset_password'),
      allowNull: false,
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  }, {
    tableName: 'security_tokens',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return SecurityToken;
}; 