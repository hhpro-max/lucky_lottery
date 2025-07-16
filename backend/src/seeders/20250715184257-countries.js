'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('countries', [
      { code: 'US', name: 'United States', currency_code: 'USD', created_at: new Date(), updated_at: new Date() },
      { code: 'GB', name: 'United Kingdom', currency_code: 'GBP', created_at: new Date(), updated_at: new Date() },
      { code: 'DE', name: 'Germany', currency_code: 'EUR', created_at: new Date(), updated_at: new Date() },
      { code: 'JP', name: 'Japan', currency_code: 'JPY', created_at: new Date(), updated_at: new Date() },
      { code: 'CN', name: 'China', currency_code: 'CNY', created_at: new Date(), updated_at: new Date() },
    ], {});
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('countries', null, {});
  }
};
