'use strict';
const bcrypt = require('bcryptjs');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('users', [
      { id: 1, email: 'admin@example.com', password_hash: await bcrypt.hash('adminpass', 10), roles: ['admin'], created_at: new Date(), updated_at: new Date(), last_login: new Date() },
      { id: 2, email: 'alice@example.com', password_hash: await bcrypt.hash('password123', 10), roles: ['player'], created_at: new Date(), updated_at: new Date(), last_login: new Date() },
      { id: 3, email: 'bob@example.com', password_hash: await bcrypt.hash('password123', 10), roles: ['player'], created_at: new Date(), updated_at: new Date(), last_login: new Date() },
    ], {});
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  }
};
