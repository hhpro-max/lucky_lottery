'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('audit_logs', [
      { actor_id: 1, action: 'login', details: JSON.stringify({ ip: '127.0.0.1' }), ip_address: '127.0.0.1', timestamp: new Date('2024-07-01T08:00:00Z'), created_at: new Date('2024-07-01T08:00:00Z'), updated_at: new Date('2024-07-01T08:00:00Z') },
      { actor_id: 2, action: 'purchase_ticket', details: JSON.stringify({ ticket_id: 1 }), ip_address: '127.0.0.2', timestamp: new Date('2024-07-01T18:00:00Z'), created_at: new Date('2024-07-01T18:00:00Z'), updated_at: new Date('2024-07-01T18:00:00Z') },
    ], {});
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('audit_logs', null, {});
  }
};
