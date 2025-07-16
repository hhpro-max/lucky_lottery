'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('email_verifications', [
      { user_id: 2, token: 'verifytoken-alice', expires_at: new Date('2024-07-10T12:00:00Z'), verified_at: new Date('2024-07-01T09:00:00Z'), created_at: new Date('2024-07-01T09:00:00Z'), updated_at: new Date('2024-07-01T09:00:00Z') },
      { user_id: 3, token: 'verifytoken-bob', expires_at: new Date('2024-07-10T12:00:00Z'), verified_at: null, created_at: new Date('2024-07-01T09:00:00Z'), updated_at: new Date('2024-07-01T09:00:00Z') },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('email_verifications', null, {});
  }
};
