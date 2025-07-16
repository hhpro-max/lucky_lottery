"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('affiliates', [
      { user_id: 2, code: 'ALICEAFF', created_at: new Date('2024-06-01T10:00:00Z'), updated_at: new Date('2024-06-01T10:00:00Z') },
      { user_id: 3, code: 'BOBAFF', created_at: new Date('2024-06-01T10:05:00Z'), updated_at: new Date('2024-06-01T10:05:00Z') },
    ], {});
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('affiliates', null, {});
  }
};
