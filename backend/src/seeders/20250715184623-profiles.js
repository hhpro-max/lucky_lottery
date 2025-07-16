'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('profiles', [
      { user_id: 1, name: 'Admin', dob: '1980-01-01', address: '1 Admin St', phone: '1111111111', KYC_status: 'approved', created_at: new Date(), updated_at: new Date() },
      { user_id: 2, name: 'Alice', dob: '1990-02-02', address: '2 Alice Ave', phone: '2222222222', KYC_status: 'approved', created_at: new Date(), updated_at: new Date() },
      { user_id: 3, name: 'Bob', dob: '1992-03-03', address: '3 Bob Blvd', phone: '3333333333', KYC_status: 'pending', created_at: new Date(), updated_at: new Date() },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('profiles', null, {});
  }
};
