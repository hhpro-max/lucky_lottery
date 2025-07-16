'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('currencies', [
      { code: 'USD', name: 'US Dollar', symbol: '$', created_at: new Date(), updated_at: new Date() },
      { code: 'EUR', name: 'Euro', symbol: '€', created_at: new Date(), updated_at: new Date() },
      { code: 'GBP', name: 'British Pound', symbol: '£', created_at: new Date(), updated_at: new Date() },
      { code: 'JPY', name: 'Japanese Yen', symbol: '¥', created_at: new Date(), updated_at: new Date() },
      { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', created_at: new Date(), updated_at: new Date() },
    ], {});
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('currencies', null, {});
  }
};
