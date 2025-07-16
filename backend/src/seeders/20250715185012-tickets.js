'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Fetch users and lottery_draws after they have been seeded
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM users ORDER BY id ASC;',
      { type: Sequelize.QueryTypes.SELECT }
    );
    const draws = await queryInterface.sequelize.query(
      'SELECT id FROM lottery_draws ORDER BY id ASC;',
      { type: Sequelize.QueryTypes.SELECT }
    );
    if (users.length < 3 || draws.length < 1) return;
    await queryInterface.bulkInsert('tickets', [
      { user_id: users[1].id, lottery_draw_id: draws[0].id, numbers: [1,2,3,4,5,6], purchase_time: new Date('2024-07-01T18:00:00Z'), status: 'winner', created_at: new Date('2024-07-01T18:00:00Z'), updated_at: new Date('2024-07-01T18:00:00Z') },
      { user_id: users[2].id, lottery_draw_id: draws[0].id, numbers: [7,8,9,10,11,12], purchase_time: new Date('2024-07-01T18:05:00Z'), status: 'loser', created_at: new Date('2024-07-01T18:05:00Z'), updated_at: new Date('2024-07-01T18:05:00Z') },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('tickets', null, {});
  }
};
