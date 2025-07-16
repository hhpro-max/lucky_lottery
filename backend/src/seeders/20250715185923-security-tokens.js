'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('security_tokens', [
      { user_id: 2, token: 'refresh-alice', type: 'refresh', expires_at: new Date('2024-08-01T12:00:00Z'), created_at: new Date('2024-07-01T09:00:00Z'), updated_at: new Date('2024-07-01T09:00:00Z') },
      { user_id: 2, token: 'reset-alice', type: 'reset_password', expires_at: new Date('2024-07-15T12:00:00Z'), created_at: new Date('2024-07-01T09:00:00Z'), updated_at: new Date('2024-07-01T09:00:00Z') },
      { user_id: 3, token: 'refresh-bob', type: 'refresh', expires_at: new Date('2024-08-01T12:00:00Z'), created_at: new Date('2024-07-01T09:00:00Z'), updated_at: new Date('2024-07-01T09:00:00Z') },
      { user_id: 3, token: 'reset-bob', type: 'reset_password', expires_at: new Date('2024-07-15T12:00:00Z'), created_at: new Date('2024-07-01T09:00:00Z'), updated_at: new Date('2024-07-01T09:00:00Z') },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('security_tokens', null, {});
  }
};
