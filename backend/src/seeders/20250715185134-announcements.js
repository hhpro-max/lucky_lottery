'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('announcements', [
      { title: 'Welcome to the Lottery App!', message: 'Good luck and play responsibly.', created_at: new Date('2024-07-01T07:00:00Z'), updated_at: new Date('2024-07-01T07:00:00Z'), expires_at: null },
      { title: 'Scheduled Maintenance', message: 'The system will be down for maintenance on July 10.', created_at: new Date('2024-07-05T09:00:00Z'), updated_at: new Date('2024-07-05T09:00:00Z'), expires_at: new Date('2024-07-10T12:00:00Z') },
    ], {});
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('announcements', null, {});
  }
};
