'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('game_types', [
      { name: 'Daily 6', description: 'Daily lottery with 6 numbers', created_at: new Date(), updated_at: new Date() },
      { name: 'Weekly Jackpot', description: 'Weekly jackpot draw', created_at: new Date(), updated_at: new Date() },
    ], {});
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('game_types', null, {});
  }
};
