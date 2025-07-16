'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Assume admin is id 2, permissions are 1-5
    await queryInterface.bulkInsert('role_permissions', [
      { role_id: 2, perm_id: 1, created_at: new Date(), updated_at: new Date() },
      { role_id: 2, perm_id: 2, created_at: new Date(), updated_at: new Date() },
      { role_id: 2, perm_id: 3, created_at: new Date(), updated_at: new Date() },
      { role_id: 2, perm_id: 4, created_at: new Date(), updated_at: new Date() },
      { role_id: 2, perm_id: 5, created_at: new Date(), updated_at: new Date() },
    ], {});
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('role_permissions', null, {});
  }
};
