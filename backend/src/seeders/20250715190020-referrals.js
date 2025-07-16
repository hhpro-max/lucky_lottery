"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Fetch affiliates after they have been seeded
    const affiliates = await queryInterface.sequelize.query(
      'SELECT id, user_id FROM affiliates ORDER BY id ASC;',
      { type: Sequelize.QueryTypes.SELECT }
    );
    if (!affiliates.length) return;
    // Example: refer user_id 3 to the first affiliate
    await queryInterface.bulkInsert("referrals", [
      { affiliate_id: affiliates[0].id, user_id: 3, created_at: new Date("2024-07-01T12:00:00Z"), updated_at: new Date("2024-07-01T12:00:00Z") }
    ], {});
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("referrals", null, {});
  }
};
