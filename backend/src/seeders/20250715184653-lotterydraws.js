'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('lottery_draws', [
      { id: 1, game_type_id: 1, draw_date: new Date('2024-07-01T20:00:00Z'), status: 'drawn', created_at: new Date('2024-07-01T19:00:00Z'), updated_at: new Date('2024-07-01T19:00:00Z') },
      { id: 2, game_type_id: 2, draw_date: new Date('2024-07-07T20:00:00Z'), status: 'scheduled', created_at: new Date('2024-07-07T19:00:00Z'), updated_at: new Date('2024-07-07T19:00:00Z') },
    ], {});
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('lottery_draws', null, {});
  }
};
