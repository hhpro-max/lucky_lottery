"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Fetch the first available ticket after they have been seeded
    const tickets = await queryInterface.sequelize.query(
      'SELECT id FROM tickets ORDER BY id ASC LIMIT 1;',
      { type: Sequelize.QueryTypes.SELECT }
    );
    if (!tickets.length) return;
    await queryInterface.bulkInsert("payouts", [
      { ticket_id: tickets[0].id, amount: 1000000.00, paid_at: new Date("2024-07-02T10:00:00Z"), payment_method: "bank_transfer", created_at: new Date("2024-07-02T10:00:00Z"), updated_at: new Date("2024-07-02T10:00:00Z") }
    ], {});
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("payouts", null, {});
  }
};
