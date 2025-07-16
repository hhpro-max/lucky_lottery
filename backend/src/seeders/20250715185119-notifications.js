'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('notifications', [
      { user_id: 2, type: 'info', message: 'You have won the jackpot!', read: false, created_at: new Date('2024-07-02T10:02:00Z'), updated_at: new Date('2024-07-02T10:02:00Z') },
      { user_id: 3, type: 'info', message: 'Better luck next time!', read: false, created_at: new Date('2024-07-02T10:03:00Z'), updated_at: new Date('2024-07-02T10:03:00Z') },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('notifications', null, {});
  }
};
