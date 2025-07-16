'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('settings', [
      { key: 'support_email', value: 'support@lotteryapp.com', description: 'Support contact email', created_at: new Date(), updated_at: new Date() },
      { key: 'min_ticket_price', value: '1', description: 'Minimum ticket price', created_at: new Date(), updated_at: new Date() },
      { key: 'max_ticket_price', value: '100', description: 'Maximum ticket price', created_at: new Date(), updated_at: new Date() },
      { key: 'currency', value: 'USD', description: 'Default currency', created_at: new Date(), updated_at: new Date() },
    ], {});
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('settings', null, {});
  }
};
