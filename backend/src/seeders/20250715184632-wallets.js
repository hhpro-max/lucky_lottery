'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('wallets', [
      { user_id: 1, balance: 1000.00, currency_code: 'USD', created_at: new Date(), updated_at: new Date() },
      { user_id: 2, balance: 100.00, currency_code: 'USD', created_at: new Date(), updated_at: new Date() },
      { user_id: 3, balance: 50.00, currency_code: 'USD', created_at: new Date(), updated_at: new Date() },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('wallets', null, {});
  }
};
