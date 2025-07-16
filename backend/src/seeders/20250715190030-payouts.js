"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("payouts", [
      { ticket_id: 1, amount: 1000000.00, paid_at: new Date("2024-07-02T10:00:00Z"), payment_method: "bank_transfer", created_at: new Date("2024-07-02T10:00:00Z"), updated_at: new Date("2024-07-02T10:00:00Z") }
    ], {});
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("payouts", null, {});
  }
};
