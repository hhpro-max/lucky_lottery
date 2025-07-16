'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('prize_tiers', [
      { lottery_draw_id: 1, match_count: 6, prize_amount: 1000000.00, created_at: new Date('2024-07-01T20:00:00Z'), updated_at: new Date('2024-07-01T20:00:00Z') },
      { lottery_draw_id: 1, match_count: 5, prize_amount: 10000.00, created_at: new Date('2024-07-01T20:00:00Z'), updated_at: new Date('2024-07-01T20:00:00Z') },
      { lottery_draw_id: 1, match_count: 4, prize_amount: 100.00, created_at: new Date('2024-07-01T20:00:00Z'), updated_at: new Date('2024-07-01T20:00:00Z') },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('prize_tiers', null, {});
  }
};
