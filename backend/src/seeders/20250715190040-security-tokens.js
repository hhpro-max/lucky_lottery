"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("security_tokens", [
      { user_id: 2, token: "token123", type: "refresh", expires_at: new Date("2024-08-01T00:00:00Z"), created_at: new Date("2024-07-01T09:00:00Z"), updated_at: new Date("2024-07-01T09:00:00Z") },
      { user_id: 3, token: "token456", type: "reset_password", expires_at: new Date("2024-08-01T00:00:00Z"), created_at: new Date("2024-07-01T09:00:00Z"), updated_at: new Date("2024-07-01T09:00:00Z") }
    ], {});
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("security_tokens", null, {});
  }
};
