'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('draw_results', [
      { lottery_draw_id: 1, winning_numbers: [1,2,3,4,5,6], created_at: new Date('2024-07-01T20:05:00Z'), updated_at: new Date('2024-07-01T20:05:00Z') },
    ], {});
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('draw_results', null, {});
  }
};
