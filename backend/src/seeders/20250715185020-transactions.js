'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Fetch wallets after they have been seeded
    const wallets = await queryInterface.sequelize.query(
      'SELECT id FROM wallets ORDER BY id ASC;',
      { type: Sequelize.QueryTypes.SELECT }
    );
    if (wallets.length < 3) return;
    await queryInterface.bulkInsert('transactions', [
      { wallet_id: wallets[0].id, type: 'credit', amount: 1000000.00, reference: 'Jackpot payout', created_at: new Date('2024-07-02T10:01:00Z'), updated_at: new Date('2024-07-02T10:01:00Z') },
      { wallet_id: wallets[1].id, type: 'debit', amount: 10.00, reference: 'Ticket purchase', created_at: new Date('2024-07-01T18:00:00Z'), updated_at: new Date('2024-07-01T18:00:00Z') },
      { wallet_id: wallets[2].id, type: 'debit', amount: 10.00, reference: 'Ticket purchase', created_at: new Date('2024-07-01T18:05:00Z'), updated_at: new Date('2024-07-01T18:05:00Z') },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('transactions', null, {});
  }
};
