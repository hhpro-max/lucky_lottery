module.exports = (sequelize, DataTypes) => {
  const EmailVerification = sequelize.define('EmailVerification', {
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
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    verified_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    tableName: 'email_verifications',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return EmailVerification;
}; 