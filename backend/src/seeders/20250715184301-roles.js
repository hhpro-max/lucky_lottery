'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('roles', [
      { id: 1, name: 'player', description: 'Regular player', created_at: new Date(), updated_at: new Date() },
      { id: 2, name: 'admin', description: 'Administrator', created_at: new Date(), updated_at: new Date() },
    ], {});
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('roles', null, {});
  }
};
