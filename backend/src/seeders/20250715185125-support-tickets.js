'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('support_tickets', [
      { user_id: 2, subject: 'How do I claim my prize?', message: 'I won the jackpot, what next?', status: 'open', created_at: new Date('2024-07-02T11:00:00Z'), updated_at: new Date('2024-07-02T11:00:00Z'), closed_at: null },
      { user_id: 3, subject: 'Ticket issue', message: 'My ticket did not win, but I matched 4 numbers.', status: 'closed', created_at: new Date('2024-07-02T11:05:00Z'), updated_at: new Date('2024-07-02T11:05:00Z'), closed_at: new Date('2024-07-03T09:00:00Z') },
    ], {});
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('support_tickets', null, {});
  }
};
