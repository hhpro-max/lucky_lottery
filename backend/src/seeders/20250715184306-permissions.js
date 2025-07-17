'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('permissions', [
      { id: 1, name: 'create_draw', description: 'Create a lottery draw', created_at: new Date(), updated_at: new Date() },
      { id: 2, name: 'close_draw', description: 'Close a lottery draw', created_at: new Date(), updated_at: new Date() },
      { id: 3, name: 'view_users', description: 'View user accounts', created_at: new Date(), updated_at: new Date() },
      { id: 4, name: 'manage_roles', description: 'Manage user roles', created_at: new Date(), updated_at: new Date() },
      { id: 5, name: 'manage_settings', description: 'Manage system settings', created_at: new Date(), updated_at: new Date() },
    ], {});
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('permissions', null, {});
  }
};
