"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Fetch lottery_draws after they have been seeded
    const draws = await queryInterface.sequelize.query(
      'SELECT id FROM lottery_draws ORDER BY id ASC;',
      { type: Sequelize.QueryTypes.SELECT }
    );
    if (draws.length < 2) return;
    await queryInterface.bulkInsert("jackpots", [
      { lottery_draw_id: draws[0].id, amount: 1000000.00, created_at: new Date("2024-07-01T19:00:00Z"), updated_at: new Date("2024-07-01T19:00:00Z") },
      { lottery_draw_id: draws[1].id, amount: 500000.00, created_at: new Date("2024-07-07T19:00:00Z"), updated_at: new Date("2024-07-07T19:00:00Z") }
    ], {});
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("jackpots", null, {});
  }
};
