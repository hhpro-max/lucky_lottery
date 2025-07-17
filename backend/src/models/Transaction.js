module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define('Transaction', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    wallet_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'wallets', key: 'id' },
      onDelete: 'CASCADE',
    },
    type: {
      type: DataTypes.ENUM('debit', 'credit'),
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: false,
    },
    reference: {
      type: DataTypes.STRING,
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
    tableName: 'transactions',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return Transaction;
}; 